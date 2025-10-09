import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { BuyerStatus, SellerType } from '../../roles/roles';

export class CreateBuyerDto {
  @IsString()
  @IsNotEmpty()
  full_name: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(6, { message: 'Parol kamida 6 ta belgidan iborat bo‘lishi kerak' })
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
