import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { HolidayCatService } from './holiday-cat.service';
import { CreateHolidayCatDto } from './dto/create-holiday-cat.dto';
import { UpdateHolidayCatDto } from './dto/update-holiday-cat.dto';

@Controller('holiday-cat')
export class HolidayCatController {
  constructor(private readonly holidayCatService: HolidayCatService) {}

  @Post()
  create(@Body() createHolidayCatDto: CreateHolidayCatDto) {
    return this.holidayCatService.create(createHolidayCatDto);
  }

  @Get()
  findAll() {
    return this.holidayCatService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.holidayCatService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateHolidayCatDto: UpdateHolidayCatDto) {
    return this.holidayCatService.update(+id, updateHolidayCatDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.holidayCatService.remove(+id);
  }
}
