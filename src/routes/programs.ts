import { Router } from "express";
import { listPrograms } from "../handlers/programs";

const router = Router();

export default () => {
	router.get("/", listPrograms);

	return router;
};
