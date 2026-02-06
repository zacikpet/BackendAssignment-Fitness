import { DataTypes, type Model, type Sequelize } from "sequelize";
import type { ExerciseModel } from "./exercise";
import type { UserModel } from "./user";

export interface ExerciseCompletionModel extends Model {
	id: number;

	completedAt: Date;
	durationSeconds: number;

	user: UserModel;
	exercise: ExerciseModel;
}

export default (sequelize: Sequelize, modelName: string) => {
	const ExerciseCompletionModelCtor = sequelize.define<ExerciseCompletionModel>(
		modelName,
		{
			id: {
				type: DataTypes.BIGINT,
				primaryKey: true,
				allowNull: false,
				autoIncrement: true,
			},
			completedAt: {
				type: DataTypes.DATE,
				allowNull: false,
			},
			durationSeconds: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
		},
		{
			paranoid: true,
			timestamps: true,
			tableName: "exercise_completions",
		},
	);

	ExerciseCompletionModelCtor.associate = (models) => {
		ExerciseCompletionModelCtor.belongsTo(models.User, {
			foreignKey: {
				name: "userID",
				allowNull: false,
			},
		});
		ExerciseCompletionModelCtor.belongsTo(models.Exercise, {
			foreignKey: {
				name: "exerciseID",
				allowNull: false,
			},
		});
	};

	return ExerciseCompletionModelCtor;
};
