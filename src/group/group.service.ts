import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Group } from './entities/group.entity';
import { University } from 'src/university/entities/university.entity';
import { Repository } from 'typeorm'
import { iSuccessRes } from 'src/interfaces/successRes';
import { CreateUniversityDto } from 'src/university/dto/create-university.dto';
import { getSuccessRes } from 'src/utils/getSuccessRes';

@Injectable()
export class GroupService {
	constructor(
		@InjectRepository(Group)
		private readonly groupRepo: Repository<Group>,
		@InjectRepository(University)
		private readonly universityRepo: Repository<University>
	) { }

	async create(createGroupDto: CreateGroupDto): Promise<iSuccessRes> {
		const existsGroup = await this.groupRepo.findOne({
			where: { name: createGroupDto.name }
		});
		if (existsGroup) {
			throw new ConflictException('Groupe alredy exists');
		}
		const university = await this.universityRepo.findOne({
			where: { id: createGroupDto.university },
		});
		if (!university) {
			throw new NotFoundException('University not found');
		}
		const newGroupe = this.groupRepo.create({
			...createGroupDto,
			university,
		});
		await this.groupRepo.save(newGroupe);
		return getSuccessRes(newGroupe, 201);
	}

	async findAll(): Promise<iSuccessRes> {
		const groups = await this.groupRepo.find({
			relations: { university: true, students: true },
			select: {
				id: true,
				name: true,
				university: {
					id: true,
					name: true,
					address: true
				},
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
			},
			order: { createdAt: 'DESC' },
		});
		return getSuccessRes(groups);
	}

	async findOne(id: number): Promise<iSuccessRes> {
		const group = await this.groupRepo.findOne({
			where: { id },
			relations: { university: true, students: true },
			select: {
				id: true,
				name: true,
				university: {
					id: true,
					name: true,
					address: true
				},
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
			},
		});
		if (!group) {
			throw new NotFoundException('Groupe not found');
		}
		return getSuccessRes(group);
	}

	async update(id: number, updateGroupDto: UpdateGroupDto): Promise<iSuccessRes> {
		const { name, university } = updateGroupDto;
		const groupe = await this.groupRepo.findOne({
			where: { id },
			relations: { university: true },
		});
		if (!groupe) {
			throw new NotFoundException('Groupe not found')
		}
		if (name) {
			const existsGroupe = await this.groupRepo.findOne({ where: { name } });
			if (existsGroupe && existsGroupe.id !== id) {
				throw new ConflictException('Group already exists');
			}
		}
		let univer = groupe.university;
		if (university) {
			const existsUniver = await this.universityRepo.findOne({
				where: { id: university },
			});
			if (!existsUniver) {
				throw new NotFoundException('University not found');
			}
			univer = existsUniver;
			delete updateGroupDto.university;
		}
		// await this.groupRepo.update({ id }, { ...updateGroupDto, univer });
		await this.groupRepo.update({ id }, { ...updateGroupDto, university: univer });
		const updateGroup = await this.groupRepo.findOne({
			where: { id },
			relations: { university: true }
		});
		return getSuccessRes(updateGroup ?? groupe);
	}

	async remove(id: number): Promise<iSuccessRes> {
		const group = await this.groupRepo.delete({ id });
		if (!group.affected) {
			throw new NotFoundException('Group not found');
		}
		return getSuccessRes({});
	}
}
