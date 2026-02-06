import { Router } from "express";
import { UpdateUserDto } from "../dtos/users";
import {
	getCurrentUser,
	getUserById,
	listUsers,
	updateUser,
} from "../handlers/users";
import { USER_ROLE } from "../utils/enums";
import { allowedRoles, validateBody } from "../utils/middlewares";
import passport from "../utils/passport-config";

const router = Router();

export default () => {
	router.get(
		"/",
		passport.authenticate("jwt", { session: false }),
		allowedRoles(USER_ROLE.USER, USER_ROLE.ADMIN),
		listUsers,
	);

	router.get(
		"/me",
		passport.authenticate("jwt", { session: false }),
		allowedRoles(USER_ROLE.USER),
		getCurrentUser,
	);

	router.get(
		"/:id",
		passport.authenticate("jwt", { session: false }),
		allowedRoles(USER_ROLE.ADMIN),
		getUserById,
	);

	router.patch(
		"/:id",
		passport.authenticate("jwt", { session: false }),
		allowedRoles(USER_ROLE.ADMIN),
		validateBody(UpdateUserDto),
		updateUser,
	);

	return router;
};
