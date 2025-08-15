import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupModule } from './group/group.module';
import { TeacherModule } from './teacher/teacher.module';
import { StudentsModule } from './students/students.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      url: 'postgres://postgres:abudev99@localhost:5432/school',
      type: 'postgres',
      autoLoadEntities: true,
      synchronize: true,
    }),
    GroupModule,
    TeacherModule,
    StudentsModule,
  ],
})
export class AppModule {}
