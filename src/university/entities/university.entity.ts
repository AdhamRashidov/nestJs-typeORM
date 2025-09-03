import { Group } from "src/group/entities/group.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('university')
export class University {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ type: "varchar" })
	name: string;

	@Column({ type: 'int', nullable: true })
	univerNumber: number;

	@Column({ type: "varchar", nullable: true })
	address: string;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;

	@OneToMany(() => Group, (group) => group.university)
	groups: Group[];
}
