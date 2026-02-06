import { DataTypes, type Model, type Sequelize } from "sequelize";
import { EXERCISE_DIFFICULTY } from "../utils/enums";
import type { ExerciseCompletionModel } from "./exerciseCompletion";
import type { ProgramModel } from "./program";

export interface ExerciseModel extends Model {
	id: number;
	difficulty: EXERCISE_DIFFICULTY;
	name: string;

	program: ProgramModel;
	exerciseCompletions: ExerciseCompletionModel;
}

export default (sequelize: Sequelize, modelName: string) => {
	const ExerciseModelCtor = sequelize.define<ExerciseModel>(
		modelName,
		{
			id: {
				type: DataTypes.BIGINT,
				primaryKey: true,
				allowNull: false,
				autoIncrement: true,
			},
			difficulty: {
				type: DataTypes.ENUM(...Object.values(EXERCISE_DIFFICULTY)),
			},
			name: {
				type: DataTypes.STRING(200),
			},
		},
		{
			paranoid: true,
			timestamps: true,
			tableName: "exercises",
		},
	);

	ExerciseModelCtor.associate = (models) => {
		ExerciseModelCtor.belongsTo(models.Program, {
			foreignKey: {
				name: "programID",
				allowNull: false,
			},
		});
	};

	ExerciseModelCtor.associate = (models) => {
		ExerciseModelCtor.hasMany(models.ExerciseCompletion, {
			foreignKey: {
				name: "exerciseID",
				allowNull: false,
			},
		});
	};

	return ExerciseModelCtor;
};
