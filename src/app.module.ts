import { Module } from '@nestjs/common';
import { UniversityModule } from './university/university.module';
import { GroupModule } from './group/group.module';
import { StudentModule } from './student/student.module';
import { ParentModule } from './parent/parent.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { University } from './university/entities/university.entity';
import { Group } from './group/entities/group.entity';
import { Student } from './student/entities/student.entity';
import { Parent } from './parent/entities/parent.entity';

@Module({
	imports: [
		ConfigModule.forRoot({
			envFilePath: '.env',
			isGlobal: true,
		}),
		TypeOrmModule.forRoot({
			type: 'postgres',
			url: String(process.env.DB_URI),
			synchronize: true,
			autoLoadEntities: true,
			entities: [University, Group, Student, Parent]
		}),
		UniversityModule,
		GroupModule,
		StudentModule,
		ParentModule
	]
})
export class AppModule { }
