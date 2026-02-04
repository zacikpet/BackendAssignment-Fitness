import {
	type NextFunction,
	type Request,
	type Response,
	Router,
} from "express";
import { models } from "../../db";

const router = Router();

export default () => {
	router.post(
		"/",
		async (req: Request, res: Response, _next: NextFunction): Promise<any> => {
			const { email, password, role } = req.body;

			const user = await models.User.create({
				email,
				password,
				role,
			});

			return res.json({
				message: "User registered successfully",
				user: { id: user.id, email: user.email, role: user.role },
			});
		},
	);

	return router;
};
