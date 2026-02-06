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
import { serializeUser } from "../utils/serializers";

const router = Router();

const { User } = models;

export default () => {
	router.get(
		"/",
		passport.authenticate("jwt", { session: false }),
		async (req: Request, res: Response, _next: NextFunction): Promise<any> => {
			const users = await User.findAll();

			const serializedUsers = users
				.map((u) => u.toJSON())
				.map(serializeUser(req.user.role));

			return res.json({
				data: serializedUsers,
				message: "List of users",
			});
		},
	);

	router.get(
		"/:id",
		passport.authenticate("jwt", { session: false }),
		async (req: Request, res: Response, _next: NextFunction): Promise<any> => {
			const user = await User.findByPk(req.params.id);

			if (!user) {
				return res.status(404).json({ message: "User not found" });
			}

			return res.json({
				data: serializeUser(req.user.role)(user.toJSON()),
				message: "User detail",
			});
		},
	);

	router.patch(
		"/:id",
		passport.authenticate("jwt", { session: false }),
		allowedRoles(USER_ROLE.ADMIN),
		async (req: Request, res: Response, _next: NextFunction): Promise<any> => {
			const { id } = req.params;
			const { name, surname, nickName, age, role } = req.body;

			const user = await User.findByPk(id);

			if (!user) {
				return res.status(404).json({ message: "User not found" });
			}

			await User.update(
				{
					name,
					surname,
					nickName,
					age,
					role,
				},
				{
					where: { id },
				},
			);

			const updatedUser = await User.findByPk(id, { plain: true });

			return res.json({
				message: "User updated successfully",
				data: serializeUser(req.user.role)(updatedUser.toJSON()),
			});
		},
	);

	return router;
};
