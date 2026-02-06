import type { NextFunction, Request, Response } from "express";
import { Op } from "sequelize";
import { models } from "../db";

const { Exercise, ExerciseCompletion, Program } = models;

export const listExercises = async (
	req: Request,
	res: Response,
	_next: NextFunction,
): Promise<any> => {
	const page = parseInt(req.query.page?.toString(), 10) || 1;
	const limit = parseInt(req.query.limit?.toString(), 10) || 10;
	const offset = (page - 1) * limit;

	const programID = parseInt(req.query.programID?.toString(), 10) ?? undefined;
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
		message: res.__("list_of_exercises"),
		pagination: {
			limit,
			offset,
			totalCount: count,
			totalPages: Math.ceil(count / limit),
		},
	});
};

export const createExercise = async (
	req: Request,
	res: Response,
	_next: NextFunction,
): Promise<any> => {
	const { name, difficulty, programID } = req.body;

	const exercise = await Exercise.create({
		name,
		difficulty,
		programID,
	});

	return res.json({
		message: res.__("exercise_created"),
		data: exercise,
	});
};

export const completeExercise = async (
	req: Request,
	res: Response,
	_next: NextFunction,
): Promise<any> => {
	const { completedAt, durationSeconds } = req.body;

	const exercise = await ExerciseCompletion.create({
		completedAt,
		durationSeconds,
		exerciseID: req.params.id,
		userID: req.user.id,
	});

	return res.json({
		message: res.__("exercise_completed"),
		data: exercise,
	});
};

export const updateExercise = async (
	req: Request,
	res: Response,
	_next: NextFunction,
): Promise<any> => {
	const { id } = req.params;
	const { name, difficulty, programID } = req.body;

	const exercise = await Exercise.findByPk(id);

	if (!exercise) {
		return res.status(404).json({ message: res.__("exercise_not_found") });
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
		message: res.__("exercise_updated"),
		data: updatedExercise,
	});
};

export const deleteExercise = async (
	req: Request,
	res: Response,
	_next: NextFunction,
): Promise<any> => {
	const { id } = req.params;

	const exercise = await Exercise.findByPk(id);

	if (!exercise) {
		return res.status(404).json({ message: res.__("exercise_not_found") });
	}

	await Exercise.destroy({ where: { id } });

	return res.json({
		message: res.__("exercise_deleted"),
	});
};

export const deleteExerciseCompletion = async (
	req: Request,
	res: Response,
	_next: NextFunction,
): Promise<any> => {
	const { completionId } = req.params;

	const exerciseCompletion = await ExerciseCompletion.findByPk(completionId);

	if (!exerciseCompletion) {
		return res.status(404).json({ message: res.__("exercise_not_completed") });
	}

	await ExerciseCompletion.destroy({ where: { id: completionId } });

	return res.json({
		message: res.__("exercise_completion_deleted"),
	});
};
