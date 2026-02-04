import {
	type NextFunction,
	type Request,
	type Response,
	Router,
} from "express";

import { models } from "../db";
import passport from "../utils/passport-config";

const router = Router();

const { Program } = models;

export default () => {
	router.get(
		"/",
		passport.authenticate("jwt", { session: false }),
		async (_req: Request, res: Response, _next: NextFunction): Promise<any> => {
			const programs = await Program.findAll();
			return res.json({
				data: programs,
				message: "List of programs",
			});
		},
	);

	return router;
};
