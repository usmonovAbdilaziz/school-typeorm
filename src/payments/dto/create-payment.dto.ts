import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { BuyerStatus, Currency } from '../../roles/roles';

export class CreatePaymentDto {
  @IsString()
  @IsNotEmpty()
  buyer_id: string;

  @IsString()
  @IsNotEmpty()
  provider: string;

  @IsString()
  @IsNotEmpty()
  card_id: string;

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsEnum(Currency)
  @IsNotEmpty()
  currency: Currency;

  @IsObject()
  @IsOptional()
  metadata: object;

  @IsEnum(BuyerStatus)
  @IsOptional()
  buyerStatus?: BuyerStatus;
}
