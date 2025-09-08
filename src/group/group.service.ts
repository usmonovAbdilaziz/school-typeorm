import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Group } from './entities/group.entity';
import { Repository } from 'typeorm';
import { handleError, succesMessage } from 'src/helpers/response';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(Group) private groupRepo: Repository<Group>,
    @InjectRedis() private readonly redis: Redis,
  ) {}
  async create(createGroupDto: CreateGroupDto) {
    try {
      const group1 = await this.groupRepo.findOne({
        where: { group_name: createGroupDto.group_name },
      });
      if (group1) {
        throw new ConflictException('This group already exists');
      }
      const newGroup = this.groupRepo.create(createGroupDto);
      await this.groupRepo.save(newGroup);
      return succesMessage(newGroup, 201);
    } catch (error) {
      handleError(error);
    }
  }

  async findAll() {
    try {
      const redisGroup = await JSON.parse(await this.redis.get('groups')||'null')
      if(redisGroup!==null){
        return succesMessage(redisGroup)
      }
      const groups = await this.groupRepo.find({
        order: { createdAt: 'ASC' },
        relations: ['teachers'],
      });
      await this.redis.set('groups',JSON.stringify(groups))
      return succesMessage(groups);
    } catch (error) {
      handleError(error);
    }
  }

  async findOne(id: number) {
    try {
      const group = await this.groupRepo.findOne({
        where: { id },
        order: { createdAt: 'ASC' },
        relations: ['teachers'],
      });
      if (!group) {
        throw new NotFoundException('Group not found');
      }
      return succesMessage(group);
    } catch (error) {
      handleError(error);
    }
  }

  async update(id: number, updateGroupDto: UpdateGroupDto) {
    try {
      await this.groupRepo.update(id, updateGroupDto);
      const group = await this.groupRepo.findOne({ where: { id } });
      if (!group) {
        throw new NotFoundException('Group not found');
      }
      return succesMessage(group);
    } catch (error) {
      handleError(error);
    }
  }

  async remove(id: number) {
    try {
      const group = await this.groupRepo.findOne({ where: { id } });
      if (!group) {
        throw new NotFoundException('Group not found');
      }
      await this.groupRepo.delete({ id });
      return succesMessage(['Deleted group from ID']);
    } catch (error) {
      handleError(error);
    }
  }
}
