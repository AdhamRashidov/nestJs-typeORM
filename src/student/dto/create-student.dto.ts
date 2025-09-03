import { Optional } from "@nestjs/common";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateStudentDto {
	@IsString()
	@IsNotEmpty()
	full_name: string;

	@IsString()
	@IsNotEmpty()
	email: string;

	@IsNumber()
	@Optional()
	age: number;

	@IsNumber()
	@IsNotEmpty()
	group: number;

	@IsNumber()
	@IsNotEmpty()
	parent: number;
}
