import {  Transform, Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { AuctionStatus, SellerType } from '../../roles/roles';

export class CreateLotDto {
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  start_time: Date;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsEnum(AuctionStatus)
  @IsOptional()
  status: AuctionStatus;

  @IsString()
  @IsNotEmpty()
  admin_id: string;

  @IsString()
  @IsOptional()
  buyer_id?: string;

  @Type(() => Number)
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

  @Transform(({ value }) =>
    typeof value === 'string' ? JSON.parse(value) : value,
  )
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
