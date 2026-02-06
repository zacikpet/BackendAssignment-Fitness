import { Router } from "express";
import {
	getCurrentUser,
	getUserById,
	listUsers,
	updateUser,
} from "../handlers/users";
import { USER_ROLE } from "../utils/enums";
import { allowedRoles } from "../utils/middlewares";
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
		allowedRoles(USER_ROLE.USER),
		passport.authenticate("jwt", { session: false }),
		getCurrentUser,
	);

	router.get(
		"/:id",
		allowedRoles(USER_ROLE.ADMIN),
		passport.authenticate("jwt", { session: false }),
		getUserById,
	);

	router.patch(
		"/:id",
		passport.authenticate("jwt", { session: false }),
		allowedRoles(USER_ROLE.ADMIN),
		updateUser,
	);

	return router;
};
