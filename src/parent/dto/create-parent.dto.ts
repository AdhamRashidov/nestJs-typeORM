import { IsEmail, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateParentDto {
	@IsString()
	@IsNotEmpty()
	full_name: string;

	@IsEmail()
	@IsNotEmpty()
	email: string;

	@IsNumber()
	@IsNotEmpty()
	students: number[];
}
