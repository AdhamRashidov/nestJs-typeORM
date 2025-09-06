import { IsArray, IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateParentDto {
	@IsString()
	@IsNotEmpty()
	full_name: string;

	@IsEmail()
	@IsNotEmpty()
	email: string;

	@IsArray()
	@IsNotEmpty()
	students: number[];
}
