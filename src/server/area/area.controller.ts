import {
  Controller,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBasicAuth,
  ApiOperation,
} from '@nestjs/swagger';
import { AreaService } from './area.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Area } from './entities/area.entity';
import { LimitAreaDto } from './dto/limit-area.dto';
import { BaseFindByIdDto, BaseFindByPIdDto } from '../base.dto';

@Controller('area')
@ApiTags('地区')
@ApiBasicAuth()
export class AreaController {
  constructor(private readonly areaService: AreaService) {
  }

  @Get('findList')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '获取列表（默认返回 []）' })
  async findList(@Query() query): Promise<Area[]> {
    return await this.areaService.selectList(query);
  }

  @Get('findListPage')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '获取列表（分页）' })
  async findListPage(@Query() limitAreaDto: LimitAreaDto): Promise<any> {
    return await this.areaService.selectListPage(limitAreaDto);
  }

  @Get('findListByPId')
  @ApiOperation({ summary: '获取列表（父 id）' })
  findListByPId(@Query() baseFindByPIdDto: BaseFindByPIdDto): Promise<any> {
    return this.areaService.selectListByPId(baseFindByPIdDto);
  }

  @Get('findTree')
  @ApiOperation({ summary: '获取树' })
  findTree(): Promise<any> {
    return this.areaService.selectTree();
  }

  @Get('findTreeByPId')
  @ApiOperation({ summary: '获取树（父 id）' })
  findTreeByPId(@Query() baseFindByPIdDto: BaseFindByPIdDto): Promise<any> {
    return this.areaService.selectTreeByPId(baseFindByPIdDto);
  }

  @Get('findById')
  @ApiOperation({ summary: '获取详情（主键 id）' })
  @UseGuards(JwtAuthGuard)
  async findById(@Query() baseFindByIdDto: BaseFindByIdDto): Promise<Area> {
    return await this.areaService.selectById(baseFindByIdDto);
  }
}
