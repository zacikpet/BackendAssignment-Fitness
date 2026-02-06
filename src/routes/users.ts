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
	router.get("/", passport.authenticate("jwt", { session: false }), listUsers);

	router.get(
		"/me",
		passport.authenticate("jwt", { session: false }),
		getCurrentUser,
	);

	router.get(
		"/:id",
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
