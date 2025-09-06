import { Optional } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateStudentDto {
	@ApiProperty({
		type: 'string',
		description: 'full name for student',
		example: 'Eshmat Toshmatov'
	})
	@IsString()
	@IsNotEmpty()
	full_name: string;

	@ApiProperty({
		type: 'string',
		description: 'email address for student',
		example: 'eshmat@gmail.com'
	})
	@IsString()
	@IsNotEmpty()
	email: string;

	@ApiProperty({
		type: 'number',
		description: 'age of the student',
		example: '19'
	})
	@IsNumber()
	@Optional()
	age: number;

	@ApiProperty({
		type: 'number',
		description: 'student`s groupe id',
		example: 7
	})
	@IsNumber()
	@IsNotEmpty()
	group: number;

	@ApiProperty({
		type: 'number',
		description: 'student`s parent id',
		example: 7
	})
	@IsNumber()
	@IsNotEmpty()
	parent: number;
}
