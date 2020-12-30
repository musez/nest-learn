import {
  Controller,
  Get,
  Post,
  Req,
  Query,
  Body,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiQuery,
  ApiBody,
  ApiBasicAuth,
  ApiOperation,
} from '@nestjs/swagger';
import { AreaService } from './area.service';
import { CreateAreaDto } from './dto/create-area.dto';
import { UpdateAreaDto } from './dto/update-area.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Area } from './entities/area.entity';

@Controller('area')
@ApiTags('地区')
@ApiBasicAuth()
export class AreaController {
  constructor(private readonly areaService: AreaService) {}

  @Get('findList')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '获取列表' })
  async findList(@Query() query): Promise<Area[]> {
    return await this.areaService.selectList(query);
  }

  @Get('findListPage')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '获取列表（分页）' })
  @ApiQuery({
    name: 'page',
    description: '第几页',
    required: false,
  })
  @ApiQuery({
    name: 'limit',
    description: '每页条数',
    required: false,
  })
  @ApiQuery({
    name: 'areaName',
    description: '名称',
    required: false,
  })
  async findListPage(@Query() query): Promise<any> {
    return await this.areaService.selectListPage(query);
  }

  @Get('findById')
  @ApiOperation({ summary: '获取详情（主键 id）' })
  @UseGuards(JwtAuthGuard)
  async findById(@Query('id') id: string): Promise<Area> {
    return await this.areaService.selectById(id);
  }

  // @Get('findTree')
  // findTree() {
  //   return this.areaService.selectTree();
  // }
}
