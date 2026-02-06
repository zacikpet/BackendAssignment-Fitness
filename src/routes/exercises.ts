import {
	type NextFunction,
	type Request,
	type Response,
	Router,
} from "express";
import { Op } from "sequelize";
import { models } from "../db";
import { USER_ROLE } from "../utils/enums";
import { allowedRoles } from "../utils/handlers";
import passport from "../utils/passport-config";

const router = Router();

const { Exercise, ExerciseCompletion, Program } = models;

export default () => {
	router.get(
		"/",
		async (req: Request, res: Response, _next: NextFunction): Promise<any> => {
			const page = parseInt(req.query.page?.toString(), 10) || 1;
			const limit = parseInt(req.query.limit?.toString(), 10) || 10;
			const offset = (page - 1) * limit;

			const programID =
				parseInt(req.query.programID?.toString(), 10) ?? undefined;
			const search = req.query.search?.toString() ?? undefined;

			let where = {};

			if (programID) {
				where = { ...where, programID };
			}

			if (search) {
				where = { ...where, name: { [Op.substring]: search } };
			}

			const { count, rows } = await Exercise.findAndCountAll({
				where,
				limit,
				offset,
				include: {
					model: Program,
				},
			});

			return res.json({
				data: rows,
				message: "List of exercises",
				pagination: {
					limit,
					offset,
					totalCount: count,
					totalPages: Math.ceil(count / limit),
				},
			});
		},
	);

	router.post(
		"/",
		passport.authenticate("jwt", { session: false }),
		allowedRoles(USER_ROLE.ADMIN),
		async (req: Request, res: Response, _next: NextFunction): Promise<any> => {
			const { name, difficulty, programID } = req.body;

			const exercise = await Exercise.create({
				name,
				difficulty,
				programID,
			});

			return res.json({
				message: "Exercise created successfully",
				data: exercise,
			});
		},
	);

	router.post(
		"/:id/completion",
		passport.authenticate("jwt", { session: false }),
		allowedRoles(USER_ROLE.USER),
		async (req: Request, res: Response, _next: NextFunction): Promise<any> => {
			const { completedAt, durationSeconds } = req.body;

			const exercise = await ExerciseCompletion.create({
				completedAt,
				durationSeconds,
				exerciseID: req.params.id,
				userID: req.user.id,
			});

			return res.json({
				message: "Exercise created successfully",
				data: exercise,
			});
		},
	);

	router.patch(
		"/:id",
		passport.authenticate("jwt", { session: false }),
		allowedRoles(USER_ROLE.ADMIN),
		async (req: Request, res: Response, _next: NextFunction): Promise<any> => {
			const { id } = req.params;
			const { name, difficulty, programID } = req.body;

			const exercise = await Exercise.findByPk(id);

			if (!exercise) {
				return res.status(404).json({ message: "Exercise not found" });
			}

			await Exercise.update(
				{
					name,
					difficulty,
					programID,
				},
				{
					where: { id },
				},
			);

			const updatedExercise = await Exercise.findByPk(id);

			return res.json({
				message: "Exercise updated successfully",
				data: updatedExercise,
			});
		},
	);

	router.delete(
		"/:id",
		passport.authenticate("jwt", { session: false }),
		allowedRoles(USER_ROLE.ADMIN),
		async (req: Request, res: Response, _next: NextFunction): Promise<any> => {
			const { id } = req.params;

			const exercise = await Exercise.findByPk(id);

			if (!exercise) {
				return res.status(404).json({ message: "Exercise not found" });
			}

			await Exercise.destroy({ where: { id } });

			return res.json({
				message: "Exercise deleted successfully",
			});
		},
	);

	router.delete(
		"/:id/completion/:completionId",
		passport.authenticate("jwt", { session: false }),
		allowedRoles(USER_ROLE.USER),
		async (req: Request, res: Response, _next: NextFunction): Promise<any> => {
			const { completionId } = req.params;

			const exerciseCompletion =
				await ExerciseCompletion.findByPk(completionId);

			if (!exerciseCompletion) {
				return res.status(404).json({ message: "Exercise not completed" });
			}

			await ExerciseCompletion.destroy({ where: { id: completionId } });

			return res.json({
				message: "Exercise completion deleted successfully",
			});
		},
	);

	return router;
};
