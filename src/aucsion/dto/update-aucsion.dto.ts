import { PartialType } from '@nestjs/mapped-types';
import { CreateAucsionDto } from './create-aucsion.dto';

export class UpdateAucsionDto extends PartialType(CreateAucsionDto) {}
