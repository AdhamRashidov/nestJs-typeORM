import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString, IsOptional } from "class-validator";

export class CreateUniversityDto {
	@ApiProperty({
		type: 'string',
		description: 'Name of University',
		example: 'Transport'
	})
	@IsString()
	@IsNotEmpty()
	name: string;

	@ApiProperty({
		type: 'number',
		description: 'Number of University',
		example: '58'
	})
	@IsNumber()
	@IsOptional()
	univerNumber: number;

	@ApiProperty({
		type: 'string',
		description: 'Address of University',
		example: 'Yunusobod'
	})
	@IsString()
	@IsOptional()
	address: string;
}
