import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiQuery, ApiBody, ApiParam, ApiHeader, ApiHeaders, ApiResponse } from '@nestjs/swagger';
import { StaffGroupService } from './staff-group.service';
import { CreateStaffGroupDto } from './dto/create-staff-group.dto';
import { UpdateStaffGroupDto } from './dto/update-staff-group.dto';

@ApiTags('用户组')
@Controller('staff-group')
export class StaffGroupController {
  constructor(private readonly staffGroupService: StaffGroupService) {}

  @Post()
  create(@Body() createStaffGroupDto: CreateStaffGroupDto) {
    return this.staffGroupService.create(createStaffGroupDto);
  }

  @Get()
  findAll() {
    return this.staffGroupService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.staffGroupService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateStaffGroupDto: UpdateStaffGroupDto) {
    return this.staffGroupService.update(+id, updateStaffGroupDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.staffGroupService.remove(+id);
  }
}
