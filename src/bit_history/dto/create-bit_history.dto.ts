import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateBitHistoryDto {
  @IsString()
  @IsNotEmpty()
  buyerId: string;

  @IsString()
  @IsNotEmpty()
  aucsionId: string;

  @IsNumber()
  @IsNotEmpty()
  amount: number;
}
