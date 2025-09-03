import { Student } from "src/student/entities/student.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('parent')
export class Parent {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ type: "varchar" })
	full_name: string;

	@Column({ type: "varchar", unique: true })
	email: string;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	udatedAt: Date;

	@OneToMany(() => Student, (student) => student.parent)
	students: Student[];
}
