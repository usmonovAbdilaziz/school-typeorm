import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateBitHistoryDto {
  @IsString()
  @IsNotEmpty()
  buyerId: string;

  @IsString()
  @IsNotEmpty()
  auctionId: string;

  @IsNumber()
  @IsNotEmpty()
  amount: number;
}
