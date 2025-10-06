import { PartialType } from '@nestjs/mapped-types';
import { CreateAdminDto } from './create-admin.dto';
import { Column } from 'typeorm';

export class UpdateAdminDto extends PartialType(CreateAdminDto) {}
