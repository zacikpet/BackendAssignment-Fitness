import { IsEmail, IsEnum, IsString } from "class-validator";
import { USER_ROLE } from "../utils/enums";

export class RegisterDto {
	@IsEmail()
	email: string;

	@IsString()
	password: string;

	@IsEnum(USER_ROLE)
	role: USER_ROLE;
}
