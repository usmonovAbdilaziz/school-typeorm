import { PartialType } from '@nestjs/mapped-types';
import { CreateAucsionResaultDto } from './create-aucsion_resault.dto';

export class UpdateAucsionResaultDto extends PartialType(CreateAucsionResaultDto) {}
