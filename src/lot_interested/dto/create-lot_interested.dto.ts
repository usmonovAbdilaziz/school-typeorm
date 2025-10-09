import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateLotInterestedDto {
  @IsString()
  @IsNotEmpty()
  lot_id: string;

  @IsString()
  @IsNotEmpty()
  buyer_id: string;

  @IsBoolean()
  @IsOptional()
  isChecked: boolean;
}
