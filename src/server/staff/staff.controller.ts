import { Controller, Get, Post, Req, Query, Body, UsePipes } from '@nestjs/common';
import { ApiTags, ApiQuery, ApiBody, ApiParam, ApiHeader, ApiHeaders, ApiResponse } from '@nestjs/swagger';
import { StaffService } from './staff.service';
import { Role } from '../role/entities/role.entity';
import { CreateStaffDto } from './dto/create.staff.dto';

@ApiTags('管理员')
@Controller('staff')
export class StaffController {
  constructor(private readonly staffService: StaffService) {
  }

  @Post('saveGroups')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: '主键 id',
        },
        groups: {
          type: 'string',
          description: '主键 id',
        },
      },
    },
  })
  saveGroups(@Body('id') id: string, @Body('groups') groups: string): Promise<any> {
    return this.staffService.insertGroups(id, groups);
  }

  @Get('findGroups')
  @ApiQuery({
    name: 'id',
    description: '主键 id',
    required: true,
  })
  findGroups(@Query('id') id: string): Promise<any> {
    return this.staffService.selectGroups(id);
  }
}
