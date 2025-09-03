import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { iSuccessRes } from 'src/interfaces/successRes';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { Repository } from 'typeorm';
import { Group } from 'src/group/entities/group.entity';
import { Parent } from 'src/parent/entities/parent.entity';
import { getSuccessRes } from 'src/utils/getSuccessRes';

@Injectable()
export class StudentService {
	constructor(
		@InjectRepository(Student) private readonly studentRepo: Repository<Student>,
		@InjectRepository(Group) private readonly groupeRepo: Repository<Group>,
		@InjectRepository(Parent) private readonly parentRepo: Repository<Parent>
	) { }

	async create(createStudentDto: CreateStudentDto): Promise<iSuccessRes> {
		const { email, group, parent } = createStudentDto;
		const groupe = await this.groupeRepo.findOne({ where: { id: group } });
		if (!groupe) {
			throw new NotFoundException('Groupe not found');
		}
		const parents = await this.parentRepo.findOne({ where: { id: parent } });
		if (!parents) {
			throw new NotFoundException('Parent not found');
		}
		const existsEmail = await this.studentRepo.findOne({
			where: { email },
		});
		if (existsEmail) {
			throw new ConflictException('Email address already exists');
		}
		const newStudent = this.studentRepo.create({
			...createStudentDto,
			group: groupe,
			parent: parents
		});
		await this.studentRepo.save(newStudent);
		return getSuccessRes(newStudent, 201);
	}

	async findAll(): Promise<iSuccessRes> {
		const students = await this.studentRepo.find({
			relations: {
				parent: true, group: {
					university: true,
				},
			},
			select: {
				id: true,
				full_name: true,
				email: true,
				age: true,
				parent: {
					id: true,
					full_name: true,
					email: true,
				},
				group: {
					id: true,
					name: true,
					university: {
						id: true,
						name: true,
						univerNumber: true,
						address: true
					},
				},
			},
			order: { createdAt: 'DESC' },
		});
		return getSuccessRes(students);
	}

	async findOne(id: number): Promise<iSuccessRes> {
		const student = await this.studentRepo.findOne({
			where: { id },
			relations: {
				parent: true, group: {
					university: true,
				},
			},
			select: {
				id: true,
				full_name: true,
				email: true,
				age: true,
				parent: {
					id: true,
					full_name: true,
					email: true,
				},
				group: {
					id: true,
					name: true,
					university: {
						id: true,
						name: true,
						univerNumber: true,
						address: true
					},
				},
			},
		});
		if (!student) {
			throw new NotFoundException('Student not found');
		}
		return getSuccessRes(student);
	}

	async update(id: number, updateStudentDto: UpdateStudentDto): Promise<iSuccessRes> {
		const { email, group, parent } = updateStudentDto;
		const student = await this.studentRepo.findOne({
			where: { id },
			relations: { group: true, parent: true },
		});
		if (!student) {
			throw new NotFoundException('Student not found');
		}
		if (email) {
			const existsEmail = await this.studentRepo.findOne({ where: { email } });
			if (existsEmail && existsEmail.id != id) {
				throw new ConflictException('Email address already exists');
			}
		}
		let groups = student.group;
		if (group) {
			const existsGroup = await this.groupeRepo.findOne({
				where: { id: group },
			});
			if (!existsGroup) {
				throw new NotFoundException('Group not found');
			}
			groups = existsGroup;
			delete updateStudentDto.group;
		}
		let parents = student.parent;
		if (parent) {
			const existsParent = await this.parentRepo.findOne({
				where: { id: parent },
			});
			if (!existsParent) {
				throw new NotFoundException('Parent not found')
			}
			parents = existsParent;
			delete updateStudentDto.parent;
		}
		await this.studentRepo.update({ id }, {
			...updateStudentDto,
			group: groups,
			parent: parents
		});
		const updatedStudent = await this.studentRepo.findOne({
			where: { id },
			relations: { group: true, parent: true },
		});
		return getSuccessRes(updatedStudent ?? student);
	}

	async remove(id: number): Promise<iSuccessRes> {
		const student = await this.studentRepo.delete({ id });
		if (!student.affected) {
			throw new NotFoundException('Student not found');
		}
		return getSuccessRes({});
	}
}
