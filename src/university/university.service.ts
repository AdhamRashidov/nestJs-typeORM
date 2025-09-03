import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUniversityDto } from './dto/create-university.dto';
import { UpdateUniversityDto } from './dto/update-university.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { University } from './entities/university.entity';
import { Not, Repository } from 'typeorm';
import { iSuccessRes } from 'src/interfaces/successRes';
import { getSuccessRes } from 'src/utils/getSuccessRes';

@Injectable()
export class UniversityService {
	constructor(
		@InjectRepository(University)
		private readonly universityRepo: Repository<University>,
	) { }

	async create(createUniversityDto: CreateUniversityDto): Promise<iSuccessRes> {
		const existsUniver = await this.universityRepo.findOne({
			where: { name: createUniversityDto.name }
		});
		if (existsUniver) {
			throw new ConflictException('University already exists');
		}
		const newUniver = this.universityRepo.create(createUniversityDto);
		await this.universityRepo.save(newUniver);
		return getSuccessRes(newUniver, 201);
	}

	async findAll(): Promise<iSuccessRes> {
		const universities = await this.universityRepo.find({
			relations: {
				groups: {
					students: {
						parent: true
					}
				}
			},
			select: {
				id: true,
				name: true,
				univerNumber: true,
				address: true,
				groups: {
					id: true,
					name: true,
					students: {
						id: true,
						full_name: true,
						email: true,
						age: true,
						parent: {
							id: true,
							full_name: true,
							email: true
						}
					}
				}
			},
			order: { createdAt: 'DESC' },
		});
		return getSuccessRes(universities);
	}

	async findOne(id: number): Promise<iSuccessRes> {
		const univer = await this.universityRepo.findOne({
			where: { id },
			relations: {
				groups: {
					students: {
						parent: true
					}
				}
			},
			select: {
				id: true,
				name: true,
				univerNumber: true,
				address: true,
				groups: {
					id: true,
					name: true,
					students: {
						id: true,
						full_name: true,
						email: true,
						age: true,
						parent: {
							id: true,
							full_name: true,
							email: true
						}
					}
				}
			},
		});
		if (!univer) {
			throw new NotFoundException('University not found');
		}
		return getSuccessRes(univer);
	}

	async update(id: number, updateUniversityDto: UpdateUniversityDto): Promise<iSuccessRes> {
		if (updateUniversityDto.name) {
			const existsName = await this.universityRepo.findOne({
				where: { name: updateUniversityDto.name, id: Not(id) }
			});
			if (existsName) {
				throw new ConflictException('Univeersity already exists');
			}
		}
		await this.universityRepo.update({ id }, updateUniversityDto);
		const updatedUniver = await this.universityRepo.findOne({ where: { id } });
		if (!updatedUniver) {
			throw new NotFoundException('Universitu not found');
		}
		return getSuccessRes(updatedUniver);
	}

	async remove(id: number): Promise<iSuccessRes> {
		const deletedUniver = await this.universityRepo.delete({ id });
		if (deletedUniver.affected && deletedUniver.affected === 0
			|| deletedUniver.affected === undefined || deletedUniver.affected === null) {
			throw new BadRequestException("Ma'lumot o'chirishda xatolik yuz berdi");
		}
		if (!deletedUniver.affected) {
			throw new NotFoundException('University not found');
		}
		return getSuccessRes({});
	}
}
