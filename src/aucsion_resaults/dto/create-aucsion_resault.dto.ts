import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAucsionResaultDto {
  @IsString()
  @IsNotEmpty()
  lot_id: string;

  @IsString()
  @IsNotEmpty()
  buyer_id: string;

  @IsString()
  @IsNotEmpty()
  final_price: string;
}
