import bcrypt from "bcrypt";
import { DataTypes, type Model, type Sequelize } from "sequelize";
import { USER_ROLE } from "../utils/enums";
import type { ExerciseCompletionModel } from "./exerciseCompletion";

export interface UserModel extends Model {
	id: number;
	email: string;
	password: string;
	role: USER_ROLE;
	name?: string;
	surname?: string;
	nickName?: string;
	age?: number;

	exerciseCompletions: ExerciseCompletionModel[];
}

export default (sequelize: Sequelize, modelName: string) => {
	const UserModelCtor = sequelize.define<UserModel>(
		modelName,
		{
			id: {
				type: DataTypes.BIGINT,
				autoIncrement: true,
				primaryKey: true,
			},
			email: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true,
			},
			password: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			role: {
				type: DataTypes.ENUM(...Object.values(USER_ROLE)),
				allowNull: false,
			},
			name: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			surname: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			nickName: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			age: {
				type: DataTypes.INTEGER,
				allowNull: true,
			},
		},
		{
			paranoid: true,
			timestamps: true,
			tableName: "users",
			hooks: {
				beforeCreate: async (user) => {
					if (user.password) {
						const salt = await bcrypt.genSalt(10);
						user.password = await bcrypt.hash(user.password, salt);
					}
				},
				beforeUpdate: async (user) => {
					if (user.changed("password")) {
						const salt = await bcrypt.genSalt(10);
						user.password = await bcrypt.hash(user.password, salt);
					}
				},
			},
		},
	);

	UserModelCtor.associate = (models) => {
		UserModelCtor.hasMany(models.ExerciseCompletion, {
			foreignKey: {
				name: "userID",
				allowNull: false,
			},
		});
	};

	return UserModelCtor;
};
