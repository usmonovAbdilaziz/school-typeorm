import { PartialType } from '@nestjs/mapped-types';
import { CreateLotInterestedDto } from './create-lot_interested.dto';

export class UpdateLotInterestedDto extends PartialType(
  CreateLotInterestedDto,
) {}
