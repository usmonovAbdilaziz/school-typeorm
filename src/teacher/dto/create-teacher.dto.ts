import { IsNotEmpty, IsNumber, IsSemVer, IsString } from 'class-validator';

export class CreateTeacherDto {
  @IsNotEmpty()
  @IsString()
  full_name: string;

  @IsNotEmpty()
  @IsString()
  phone_number: string;

  @IsNotEmpty()
  @IsString()
  specialist: string;

  @IsNotEmpty()
  @IsNumber()
  groupId: number;
}
