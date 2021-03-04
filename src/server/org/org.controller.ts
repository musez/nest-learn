import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import {
  ApiTags,
  ApiBasicAuth,
  ApiOperation,
} from '@nestjs/swagger';
import { OrgService } from './org.service';
import { CreateOrgDto } from './dto/create-org.dto';
import { UpdateOrgDto } from './dto/update-org.dto';

@Controller('org')
@ApiTags('组织机构')
@ApiBasicAuth()
export class OrgController {
  constructor(private readonly orgService: OrgService) {}

  @Post()
  create(@Body() createOrgDto: CreateOrgDto) {
    return this.orgService.create(createOrgDto);
  }

  @Get()
  findAll() {
    return this.orgService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orgService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateOrgDto: UpdateOrgDto) {
    return this.orgService.update(+id, updateOrgDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orgService.remove(+id);
  }
}
