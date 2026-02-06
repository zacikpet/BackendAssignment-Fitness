import type { NextFunction, Request, Response } from "express";
import { models } from "../db";
import { serializeUser } from "../utils/serializers";

const { User, ExerciseCompletion, Exercise } = models;

export const listUsers = async (
	req: Request,
	res: Response,
	_next: NextFunction,
): Promise<any> => {
	const users = await User.findAll();

	const serializedUsers = users
		.map((u) => u.toJSON())
		.map(serializeUser(req.user.role));

	return res.json({
		data: serializedUsers,
		message: res.__("list_of_users"),
	});
};

export const getCurrentUser = async (
	req: Request,
	res: Response,
	_next: NextFunction,
): Promise<any> => {
	const user = await User.findByPk(req.user.id, {
		include: {
			model: ExerciseCompletion,
			include: [{ model: Exercise }],
		},
	});

	if (!user) {
		return res.status(404).json({ message: res.__("user_not_found") });
	}

	const completedExercises = user.exerciseCompletions.map((c) => ({
		...c.exercise.toJSON(),
		completionID: c.id,
		durationSeconds: c.durationSeconds,
		completedAt: c.completedAt,
	}));

	return res.json({
		data: {
			name: user.name,
			surname: user.surname,
			age: user.age,
			nickName: user.nickName,
			completedExercises,
		},
		message: res.__("user_detail"),
	});
};

export const getUserById = async (
	req: Request,
	res: Response,
	_next: NextFunction,
): Promise<any> => {
	const user = await User.findByPk(req.params.id);

	if (!user) {
		return res.status(404).json({ message: res.__("user_not_found") });
	}

	return res.json({
		data: serializeUser(req.user.role)(user.toJSON()),
		message: res.__("list_of_users"),
	});
};

export const updateUser = async (
	req: Request,
	res: Response,
	_next: NextFunction,
): Promise<any> => {
	const { id } = req.params;
	const { name, surname, nickName, age, role } = req.body;

	const user = await User.findByPk(id);

	if (!user) {
		return res.status(404).json({ message: res.__("user_not_found") });
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
		message: res.__("user_updated"),
		data: serializeUser(req.user.role)(updatedUser.toJSON()),
	});
};
