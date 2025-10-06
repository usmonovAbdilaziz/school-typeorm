import { PartialType } from '@nestjs/mapped-types';
import { CreateLotCommetDto } from './create-lot_commet.dto';

export class UpdateLotCommetDto extends PartialType(CreateLotCommetDto) {}
