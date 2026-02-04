import http from "node:http";
import express from "express";

import { sequelize } from "./db";
import ExerciseRouter from "./routes/exercises";
import ProgramRouter from "./routes/programs";
import RegisterRouter from "./routes/register";
import passport from "./utils/passport-config";

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(passport.initialize());

app.use("/register", RegisterRouter());
app.use("/programs", ProgramRouter());
app.use("/exercises", ExerciseRouter());

const httpServer = http.createServer(app);

try {
	sequelize.sync();
} catch {
	console.log("Sequelize sync error");
}

httpServer
	.listen(8000)
	.on("listening", () => console.log(`Server started at port ${8000}`));

export default httpServer;
