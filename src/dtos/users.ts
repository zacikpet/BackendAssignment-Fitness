import {
	IsEnum,
	IsNumber,
	IsNumberString,
	IsOptional,
	IsString,
} from "class-validator";
import { USER_ROLE } from "../utils/enums";

export class GetUserByIdDto {
	@IsNumberString()
	id: string;
}
export class UpdateUserDto {
	@IsOptional()
	@IsString()
	name?: string;

	@IsOptional()
	@IsString()
	surname?: string;

	@IsOptional()
	@IsString()
	nickName?: string;

	@IsOptional()
	@IsNumber()
	age?: number;

	@IsOptional()
	@IsEnum(USER_ROLE)
	role?: USER_ROLE;
}
