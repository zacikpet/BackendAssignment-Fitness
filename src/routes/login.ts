import bcrypt from "bcrypt";
import { type Request, type Response, Router } from "express";
import jwt from "jsonwebtoken";
import { models } from "../db";

const router = Router();

export default () => {
	router.post("/", async (req: Request, res: Response): Promise<any> => {
		const { email, password } = req.body;

		const user = await models.User.findOne({ where: { email } });

		if (!user) {
			return res.status(401).json({ message: "Invalid email or password" });
		}

		const isPasswordValid = await bcrypt.compare(password, user.password);

		if (!isPasswordValid) {
			return res.status(401).json({ message: "Invalid email or password" });
		}

		const token = jwt.sign(
			{ id: user.id, email: user.email },
			process.env.JWT_SECRET,
			{ expiresIn: "1h" },
		);

		return res.json({
			message: "Login successful",
			data: { token, user: { id: user.id, role: user.role } },
		});
	});

	return router;
};
