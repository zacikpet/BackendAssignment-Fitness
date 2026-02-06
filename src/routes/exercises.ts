import { Router } from "express";
import {
	CompleteExerciseDto,
	CreateExerciseDto,
	DeleteExerciseCompletionDto,
	DeleteExerciseDto,
	ListExercisesDto,
	UpdateExerciseDto,
} from "../dtos/exercises";
import {
	completeExercise,
	createExercise,
	deleteExercise,
	deleteExerciseCompletion,
	listExercises,
	updateExercise,
} from "../handlers/exercises";
import { USER_ROLE } from "../utils/enums";
import {
	allowedRoles,
	validateBody,
	validateParams,
	validateQuery,
} from "../utils/middlewares";
import passport from "../utils/passport-config";

const router = Router();

export default () => {
	router.get("/", validateQuery(ListExercisesDto), listExercises);

	router.post(
		"/",
		passport.authenticate("jwt", { session: false }),
		allowedRoles(USER_ROLE.ADMIN),
		validateBody(CreateExerciseDto),
		createExercise,
	);

	router.post(
		"/:id/completion",
		passport.authenticate("jwt", { session: false }),
		allowedRoles(USER_ROLE.USER),
		validateBody(CompleteExerciseDto),
		completeExercise,
	);

	router.patch(
		"/:id",
		passport.authenticate("jwt", { session: false }),
		allowedRoles(USER_ROLE.ADMIN),
		validateBody(UpdateExerciseDto),
		updateExercise,
	);

	router.delete(
		"/:id",
		passport.authenticate("jwt", { session: false }),
		allowedRoles(USER_ROLE.ADMIN),
		validateParams(DeleteExerciseDto),
		deleteExercise,
	);

	router.delete(
		"/:id/completion/:completionId",
		passport.authenticate("jwt", { session: false }),
		allowedRoles(USER_ROLE.USER),
		validateParams(DeleteExerciseCompletionDto),
		deleteExerciseCompletion,
	);

	return router;
};
