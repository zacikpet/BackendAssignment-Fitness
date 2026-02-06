import { Router } from "express";
import { RegisterDto } from "../dtos/register";
import { register } from "../handlers/register";
import { validateBody } from "../utils/middlewares";

const router = Router();

export default () => {
	router.post("/", validateBody(RegisterDto), register);

	return router;
};
