import { IsNotEmpty, IsString } from "class-validator";

export class CreateAucsionDto {
  
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  adminId: string;

  @IsString()
  @IsNotEmpty()
  lotId: string;
}
