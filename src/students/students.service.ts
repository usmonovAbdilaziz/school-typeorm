import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { Repository } from 'typeorm';
import { GroupService } from 'src/group/group.service';
import { handleError, succesMessage } from 'src/helpers/response';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student) private studentRepo: Repository<Student>,
    @InjectRedis() private readonly redis: Redis,
    private groupServise: GroupService,
  ) {}
  async create(createStudentDto: CreateStudentDto) {
    try {
      const { username, email } = createStudentDto;
      const student = await this.studentRepo.findOne({
        where: { email },
      });
      if (student) {
        throw new ConflictException('Student already exists');
      }
      const student1 = await this.studentRepo.findOne({
        where: { username },
      });
      if (student1) {
        throw new ConflictException('Student already exists');
      }
      const group = await this.groupServise.findOne(createStudentDto.groupId);
      if (!group) {
        throw new NotFoundException('Group not found');
      }
      const newStudent = this.studentRepo.create({
        ...createStudentDto,
        group: group.data,
      });
      await this.studentRepo.save(newStudent);
      return succesMessage(newStudent, 201);
    } catch (error) {
      handleError(error);
    }
  }

  async findAll() {
    try {
      const redisStudents =JSON.parse(await this.redis.get('students')||'null')
      if(redisStudents!==null){
        return succesMessage(redisStudents)
      }
      const students = await this.studentRepo.find({ relations: ['group'] });
      await this.redis.set('students',JSON.stringify(students))
      return succesMessage(students);
    } catch (error) {
      handleError(error);
    }
  }

  async findOne(id: number) {
    try {
      const student = await this.studentRepo.findOne({ where: { id } });
      if (!student) {
        throw new NotFoundException('Student not found');
      }
      return succesMessage(student);
    } catch (error) {
      handleError(error);
    }
  }

  async update(id: number, updateStudentDto: UpdateStudentDto) {
    try {
      await this.studentRepo.update(id, updateStudentDto);
      const student = await this.findOne(id);
      if (!student) {
        throw new NotFoundException('Student not found');
      }
      return succesMessage(student.data);
    } catch (error) {
      handleError(error);
    }
  }

  async remove(id: number) {
    try {
      const student = await this.findOne(id);
      if (!student) {
        throw new NotFoundException('Student not found');
      }
      await this.studentRepo.delete({ id });
      return succesMessage(['Deleted student from ID']);
    } catch (error) {
      handleError(error);
    }
  }
}
