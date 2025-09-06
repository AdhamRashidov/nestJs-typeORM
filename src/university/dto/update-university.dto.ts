import { PartialType } from '@nestjs/mapped-types';
import { CreateUniversityDto } from './create-university.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class UpdateUniversityDto extends PartialType(CreateUniversityDto) {
	@ApiProperty({
		type: 'string',
		description: 'Address of University',
		example: 'Yunusobod'
	})
	@IsString()
	@IsOptional()
	address: string;
}
