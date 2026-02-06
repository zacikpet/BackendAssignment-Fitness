import bcrypt from "bcrypt";
import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { models } from "../db";

export const login = async (req: Request, res: Response): Promise<any> => {
	const { email, password } = req.body;

	const user = await models.User.findOne({ where: { email } });

	if (!user) {
		return res
			.status(401)
			.json({ message: res.__("invalid_email_or_password") });
	}

	const isPasswordValid = await bcrypt.compare(password, user.password);

	if (!isPasswordValid) {
		return res
			.status(401)
			.json({ message: res.__("invalid_email_or_password") });
	}

	const token = jwt.sign(
		{ id: user.id, email: user.email },
		process.env.JWT_SECRET,
		{ expiresIn: "1h" },
	);

	return res.json({
		message: res.__("login_successful"),
		data: { token, user: { id: user.id } },
	});
};
