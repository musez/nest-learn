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

  @Post('saveRoles')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: '主键 id',
        },
        roles: {
          type: 'string',
          description: '主键 id',
        },
      },
    },
  })
  saveRoles(@Body('id') id: string, @Body('roles') roles: string): Promise<any> {
    return this.staffService.insertRoles(id, roles);
  }

  @Get('findRoles')
  @ApiQuery({
    name: 'id',
    description: '主键 id',
    required: true,
  })
  findRoles(@Query('id') id: string): Promise<any> {
    return this.staffService.selectRoles(id);
  }
}
