import { PartialType } from '@nestjs/mapped-types';
import { CreateBitHistoryDto } from './create-bit_history.dto';

export class UpdateBitHistoryDto extends PartialType(CreateBitHistoryDto) {}
