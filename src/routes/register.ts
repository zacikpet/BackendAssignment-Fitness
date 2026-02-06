import { Router } from "express";
import { register } from "../handlers/register";

const router = Router();

export default () => {
	router.post("/", register);

	return router;
};
