import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
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
  @Transform(({ value }) => value === 'true' || value === true)
  isPlaying?: boolean;

  @IsString()
  @IsNotEmpty()
  admin_id: string;

  @IsString()
  @IsOptional()
  buyer_id?: string;

  @IsNumber()
  @IsNotEmpty()
  likesCount: number;

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

  @IsObject()
  @IsNotEmpty()
  description: {
    key: string;
    val: string;
  };

  @IsString()
  @IsNotEmpty()
  starting_bit: string;

  // Removed seller_id as seller fields are now directly in lot
}
