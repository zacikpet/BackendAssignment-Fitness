import {
	type NextFunction,
	type Request,
	type Response,
	Router,
} from "express";

import { models } from "../db";

const router = Router();

const { Program } = models;

export default () => {
	router.get(
		"/",
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
