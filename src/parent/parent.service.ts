import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateParentDto } from './dto/create-parent.dto';
import { UpdateParentDto } from './dto/update-parent.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Parent } from './entities/parent.entity';
import { Repository } from 'typeorm';
import { iSuccessRes } from 'src/interfaces/successRes';
import { getSuccessRes } from 'src/utils/getSuccessRes';

@Injectable()
export class ParentService {
	constructor(
		@InjectRepository(Parent) private readonly parentRepo: Repository<Parent>,
	) { }

	async create(createParentDto: CreateParentDto): Promise<iSuccessRes> {
		const existsEmail = await this.parentRepo.findOne({
			where: { email: createParentDto.email }
		});
		if (existsEmail) {
			throw new ConflictException('Email address already exists');
		}
		const { students, ...parentData } = createParentDto as any;
		const newParent = this.parentRepo.create({
			...parentData,
			students: students ? students.map((id: number) => ({ id })) : [],
		});
		await this.parentRepo.save(newParent);
		return getSuccessRes(newParent, 201);
	}

	async findAll(): Promise<iSuccessRes> {
		const parents = await this.parentRepo.find({
			relations: { students: true },
			select: {
				id: true,
				full_name: true,
				email: true,
				students: {
					id: true,
					full_name: true,
					email: true,
					age: true
				},
			},
			order: { createdAt: 'DESC' },
		});
		return getSuccessRes(parents);
	}

	async findOne(id: number): Promise<iSuccessRes> {
		const parent = await this.parentRepo.findOne({
			where: { id },
			relations: { students: true },
			select: {
				id: true,
				full_name: true,
				email: true,
				students: {
					id: true,
					full_name: true,
					email: true,
					age: true
				},
			},
		});
		if (!parent) {
			throw new NotFoundException('Parent not found');
		}
		return getSuccessRes(parent);
	}

	async update(id: number, updateParentDto: UpdateParentDto): Promise<iSuccessRes> {
		const parent = await this.parentRepo.findOne({
			where: { id },
			relations: { students: true },
		});
		if (!parent) {
			throw new NotFoundException('parent not found');
		}
		if (updateParentDto.email) {
			const existsEmail = await this.parentRepo.findOne({
				where: { email: updateParentDto.email },
			});
			if (existsEmail && existsEmail.id != id) {
				throw new ConflictException('Email addess already exists');
			}
		}

		const { students, ...parentData } = updateParentDto as any;
		await this.parentRepo.update(
			{ id },
			{
				...parentData,
				...(students && { students: students.map((id: number) => ({ id })) }),
			}
		);
		const updateParent = await this.parentRepo.findOne({
			where: { id },
			relations: { students: true },
		});
		if (!updateParent) {
			throw new NotFoundException('Parent not found');
		}
		return getSuccessRes(updateParent);
	}

	async remove(id: number): Promise<iSuccessRes> {
		const parent = await this.parentRepo.delete({ id });
		if (!parent.affected) {
			throw new NotFoundException('Parent not found');
		}
		return getSuccessRes({});
	}
}
