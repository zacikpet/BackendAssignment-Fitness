import { Router } from "express";
import { LoginDto } from "../dtos/login";
import { login } from "../handlers/login";
import { validateBody } from "../utils/middlewares";

const router = Router();

export default () => {
	router.post("/", validateBody(LoginDto), login);

	return router;
};
