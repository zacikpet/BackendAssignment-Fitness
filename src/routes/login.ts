import { Router } from "express";
import { login } from "../handlers/login";

const router = Router();

export default () => {
	router.post("/", login);

	return router;
};
