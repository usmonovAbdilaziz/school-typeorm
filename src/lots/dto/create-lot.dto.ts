import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { AuctionStatus, SellerType } from '../../roles/roles';
class DescriptionDto {
  @IsString()
  @IsNotEmpty()
  key: string;

  @IsString()
  @IsNotEmpty()
  val: string;
}
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
  status: AuctionStatus = AuctionStatus.PENDING;

  @IsString()
  @IsNotEmpty()
  admin_id: string;

  @IsString()
  @IsOptional()
  buyer_id?: string;

  @IsString()
  @IsNotEmpty()
  info:string

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
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DescriptionDto)
  description: DescriptionDto[];

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsString()
  @IsNotEmpty()
  starting_bit: string;

  // Removed seller_id as seller fields are now directly in lot
}
