import { Transform } from "class-transformer";
import { IsNumber, IsOptional, Min } from "class-validator";

export class PaginationDto {
	@IsOptional()
	@IsNumber()
	@Min(1)
	@Transform((x) => +x)
	limit: number;

	@IsOptional()
	@IsNumber()
	@Min(1)
	@Transform((x) => +x)
	page: number;
}
