import {
	IsDateString,
	IsEnum,
	IsNumber,
	IsNumberString,
	IsOptional,
	IsString,
} from "class-validator";
import { EXERCISE_DIFFICULTY } from "../utils/enums";
import { PaginationDto } from "./pagination";

export class ListExercisesDto extends PaginationDto {
	@IsOptional()
	@IsString()
	search?: string;

	@IsOptional()
	@IsNumberString()
	programID?: string;
}

export class CreateExerciseDto {
	@IsString()
	name: string;

	@IsEnum(EXERCISE_DIFFICULTY)
	difficulty: EXERCISE_DIFFICULTY;

	@IsNumber()
	programID: number;
}

export class CompleteExerciseDto {
	@IsNumber()
	durationSeconds: number;

	@IsDateString()
	completedAt: string;
}

export class UpdateExerciseDto {
	@IsOptional()
	@IsString()
	name?: string;

	@IsOptional()
	@IsEnum(EXERCISE_DIFFICULTY)
	difficulty?: EXERCISE_DIFFICULTY;

	@IsOptional()
	@IsNumber()
	programID?: number;
}
