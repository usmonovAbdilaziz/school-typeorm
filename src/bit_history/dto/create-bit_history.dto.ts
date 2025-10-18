import { IsNotEmpty, IsNumber, IsObject, IsString } from "class-validator";

export class CreateBitHistoryDto {
  @IsString()
  @IsNotEmpty()
  lotId: string;

  @IsObject()
  @IsNotEmpty()
  lotAction:{
    buyerId:string,
    amount:number
  }

}
