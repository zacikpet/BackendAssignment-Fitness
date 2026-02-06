import { equal } from "assert";
import {
	type NextFunction,
	type Request,
	type Response,
	Router,
} from "express";
import { models } from "../db";
import { USER_ROLE } from "../utils/enums";
import { allowedRoles } from "../utils/handlers";
import passport from "../utils/passport-config";

const router = Router();

const { Exercise, Program, ExerciseCompletion } = models;

export default () => {
	router.get(
		"/",
		async (_req: Request, res: Response, _next: NextFunction): Promise<any> => {
			const exercises = await Exercise.findAll({
				include: [
					{
						model: Program,
					},
				],
			});

			return res.json({
				data: exercises,
				message: "List of exercises",
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
