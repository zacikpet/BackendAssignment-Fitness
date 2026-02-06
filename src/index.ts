import "reflect-metadata";
import http from "node:http";
import path from "node:path";
import express from "express";
import { I18n } from "i18n";
import { sequelize } from "./db";
import ExerciseRouter from "./routes/exercises";
import LoginRouter from "./routes/login";
import ProgramRouter from "./routes/programs";
import RegisterRouter from "./routes/register";
import UserRouter from "./routes/users";
import { internalErrorHandler } from "./utils/middlewares";
import passport from "./utils/passport-config";

const i18n = new I18n({
	locales: ["en", "sk"],
	defaultLocale: "en",
	directory: path.join(__dirname, "locales"),
	header: "language",
});
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(passport.initialize());
app.use(i18n.init);

app.use("/register", RegisterRouter());
app.use("/login", LoginRouter());
app.use("/programs", ProgramRouter());
app.use("/exercises", ExerciseRouter());
app.use("/users", UserRouter());

app.use(internalErrorHandler);

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
