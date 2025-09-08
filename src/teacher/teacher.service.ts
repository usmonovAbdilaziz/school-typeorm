import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Teacher } from './entities/teacher.entity';
import { Repository } from 'typeorm';
import { GroupService } from 'src/group/group.service';
import { handleError, succesMessage } from 'src/helpers/response';
import { NotFoundError, throwError } from 'rxjs';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';

@Injectable()
export class TeacherService {
  constructor(
    @InjectRepository(Teacher) private teacherRepo: Repository<Teacher>,
    @InjectRedis() private readonly redis: Redis,
    private groupService: GroupService,
  ) {}
  async create(createTeacherDto: CreateTeacherDto) {
    try {
      const existing = await this.teacherRepo.findOne({
        where: { phone_number: createTeacherDto.phone_number },
      });

      if (existing) {
        throw new ConflictException('Teacher already exists');
      }

      // Guruhni olib kelamiz
      const group = await this.groupService.findOne(createTeacherDto.groupId);
      if (!group) {
        throw new NotFoundException('Group not found');
      }

      const newTeacher = this.teacherRepo.create({
        ...createTeacherDto,
        group: group.data,
      });

      await this.teacherRepo.save(newTeacher);

      return succesMessage(newTeacher, 201);
    } catch (error) {
      handleError(error);
    }
  }

  async findAll() {
    try {
      const redisTeacher = JSON.parse(await this.redis.get('teachers')||'null')
      if(redisTeacher!==null){
        return succesMessage(redisTeacher)
      }
      const teachers = await this.teacherRepo.find({
        relations: ['group'],
      });
      await this.redis.set('teachers',JSON.stringify(teachers))
      return succesMessage(teachers);
    } catch (error) {
      handleError(error);
    }
  }

  async findOne(id: number) {
    try {
      const teacher = await this.teacherRepo.findOne({ where: { id } });
      if (!teacher) {
        throw new NotFoundException('Teacher not found');
      }
      return succesMessage(teacher);
    } catch (error) {
      handleError(error);
    }
  }

  async update(id: number, updateTeacherDto: UpdateTeacherDto) {
    try {
      await this.teacherRepo.update(id, updateTeacherDto);
      const teacher = await this.teacherRepo.findOne({ where: { id } });
      if (!teacher) {
        throw new NotFoundException('Teacher not found');
      }
      return succesMessage(teacher);
    } catch (error) {
      handleError(error);
    }
  }

  async remove(id: number) {
    try {
      const teacher = await this.teacherRepo.findOne({ where: { id } });
      if (!teacher) {
        throw new NotFoundError('Teacher not found');
      }
      await this.teacherRepo.delete({ id });
      return succesMessage(['Deleted teacher from ID']);
    } catch (error) {
      handleError(error);
    }
  }
}
