import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { LotStatus } from 'src/roles/roles';

export class CreateLotDto {
  @IsString()
  @IsNotEmpty()
  seller_id: string;

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  start_time: Date;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsEnum(LotStatus)
  @IsOptional()
  status?: LotStatus;
}
