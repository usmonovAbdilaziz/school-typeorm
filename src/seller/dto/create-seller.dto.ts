import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { SellerType } from 'src/roles/roles';

export class CreateSellerDto {
  @IsString()
  @IsNotEmpty()
  admin_id: string;

  @IsString()
  @IsNotEmpty()
  full_name: string;

  @IsString()
  @IsNotEmpty()
  tool_name: string;

  @IsEnum(SellerType)
  @IsNotEmpty()
  tool_type: SellerType;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  starting_bit: string;
}
