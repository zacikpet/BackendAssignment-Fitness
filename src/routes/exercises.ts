import { Router } from "express";
import {
	completeExercise,
	createExercise,
	deleteExercise,
	deleteExerciseCompletion,
	listExercises,
	updateExercise,
} from "../handlers/exercises";
import { USER_ROLE } from "../utils/enums";
import { allowedRoles } from "../utils/middlewares";
import passport from "../utils/passport-config";

const router = Router();

export default () => {
	router.get("/", listExercises);

	router.post(
		"/",
		passport.authenticate("jwt", { session: false }),
		allowedRoles(USER_ROLE.ADMIN),
		createExercise,
	);

	router.post(
		"/:id/completion",
		passport.authenticate("jwt", { session: false }),
		allowedRoles(USER_ROLE.USER),
		completeExercise,
	);

	router.patch(
		"/:id",
		passport.authenticate("jwt", { session: false }),
		allowedRoles(USER_ROLE.ADMIN),
		updateExercise,
	);

	router.delete(
		"/:id",
		passport.authenticate("jwt", { session: false }),
		allowedRoles(USER_ROLE.ADMIN),
		deleteExercise,
	);

	router.delete(
		"/:id/completion/:completionId",
		passport.authenticate("jwt", { session: false }),
		allowedRoles(USER_ROLE.USER),
		deleteExerciseCompletion,
	);

	return router;
};
