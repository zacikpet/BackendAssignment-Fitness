import type { NextFunction, Request, Response } from "express";
import { models } from "../db";

export const register = async (
	req: Request,
	res: Response,
	_next: NextFunction,
): Promise<any> => {
	const { email, password, role } = req.body;

	const user = await models.User.create({
		email,
		password,
		role,
	});

	return res.json({
		message: res.__("registration_successful"),
		data: {
			user: {
				id: user.id,
				email: user.email,
				role: user.role,
			},
		},
	});
};
