import { Optional } from "@nestjs/common";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateUniversityDto {
	@IsString()
	@IsNotEmpty()
	name: string;

	@IsNumber()
	@Optional()
	univerNumber: number;

	@IsString()
	@Optional()
	address: string;
}
