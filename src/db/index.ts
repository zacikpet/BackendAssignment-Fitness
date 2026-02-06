import fs from "node:fs";
import dotenv from "dotenv";
import { Sequelize } from "sequelize";
import defineExercise from "./exercise";
import defineExerciseCompletion from "./exerciseCompletion";
import defineProgram from "./program";
import defineUser from "./user";

dotenv.config();

const sequelize: Sequelize = new Sequelize(
	process.env.POSTGRES_DB,
	process.env.POSTGRES_USER,
	process.env.POSTGRES_PASSWORD,
	{
		host: process.env.POSTGRES_HOST,
		port: parseInt(process.env.POSTGRES_PORT, 10),
		logging: false,
		dialect: "postgres",
	},
);

sequelize
	.authenticate()
	.catch((e: any) => console.error(`Unable to connect to the database${e}.`));

const Exercise = defineExercise(sequelize, "exercise");
const Program = defineProgram(sequelize, "program");
const User = defineUser(sequelize, "user");
const ExerciseCompletion = defineExerciseCompletion(
	sequelize,
	"exerciseCompletion",
);

const models = {
	Exercise,
	Program,
	User,
	ExerciseCompletion,
};
type Models = typeof models;

// check if every model is imported
const modelsFiles = fs.readdirSync(__dirname);
// -1 because index.ts can not be counted
if (Object.keys(models).length !== modelsFiles.length - 1) {
	throw new Error("You probably forgot import database model!");
}

Object.values(models).forEach((value: any) => {
	if (value.associate) {
		value.associate(models);
	}
});

export { models, sequelize };
export type { Models };
