import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { BuyerStatus, SellerType } from 'src/roles/roles';

export class CreateBuyerDto {
  @IsString()
  @IsNotEmpty()
  full_name: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsOptional()
  newPassword?: string;

  @IsEnum(SellerType)
  @IsNotEmpty()
  interested: SellerType;

  @IsEnum(BuyerStatus)
  @IsOptional()
  buyerStatus?: BuyerStatus;
}
