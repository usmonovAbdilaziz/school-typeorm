import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { LotStatus, SellerType } from '../../roles/roles';

export class CreateLotDto {
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  start_time: Date;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsBoolean()
  @IsOptional()
  isPlaying: boolean;

  @IsString()
  @IsNotEmpty()
  admin_id: string;

  @IsString()
  @IsNotEmpty()
  full_name: string;

  @IsString()
  @IsNotEmpty()
  tool_name: string;

  @IsEnum(SellerType)
  @IsNotEmpty()
  tool_type: SellerType;

  @IsEnum(LotStatus)
  @IsOptional()
  status: LotStatus;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  starting_bit: string;
}
