import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { AucsionResaultsService } from './aucsion_resaults.service';
import { CreateAucsionResaultDto } from './dto/create-aucsion_resault.dto';
import { UpdateAucsionResaultDto } from './dto/update-aucsion_resault.dto';
import { AuthGuard } from '../guard/auth-guard';
import { RolesGuard } from '../guard/roles-guard';

@Controller('aucsion-resaults')
@UseGuards(AuthGuard, RolesGuard)
export class AucsionResaultsController {
  constructor(
    private readonly aucsionResaultsService: AucsionResaultsService,
  ) {}

  @Post()
  create(@Body() createAucsionResaultDto: CreateAucsionResaultDto) {
    return this.aucsionResaultsService.create(createAucsionResaultDto);
  }

  @Get()
  findAll() {
    return this.aucsionResaultsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.aucsionResaultsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAucsionResaultDto: UpdateAucsionResaultDto,
  ) {
    return this.aucsionResaultsService.update(id, updateAucsionResaultDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.aucsionResaultsService.remove(id);
  }
}
