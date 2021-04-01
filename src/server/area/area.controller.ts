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
import { SearchAreaDto } from './dto/search-area.dto';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';

@Controller('area')
@ApiTags('地区')
@ApiBasicAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class AreaController {
  constructor(private readonly areaService: AreaService) {
  }

  @Get('findList')
  @Permissions('system:area:findList')
  @ApiOperation({ summary: '获取列表（默认返回 []）' })
  async findList(@Query() searchAreaDto: SearchAreaDto): Promise<Area[]> {
    return await this.areaService.selectList(searchAreaDto);
  }

  @Get('findListPage')
  @Permissions('system:area:findListPage')
  @ApiOperation({ summary: '获取列表（分页）' })
  async findListPage(@Query() limitAreaDto: LimitAreaDto): Promise<any> {
    return await this.areaService.selectListPage(limitAreaDto);
  }

  @Get('findListByPId')
  @Permissions('system:area:findListByPId')
  @ApiOperation({ summary: '获取子代列表（父 id）' })
  async findListByPId(@Query() baseFindByPIdDto: BaseFindByPIdDto): Promise<any> {
    return this.areaService.selectListByPId(baseFindByPIdDto);
  }

  @Get('findTree')
  @Permissions('system:area:findTree')
  @ApiOperation({ summary: '获取树' })
  async findTree(@Query() baseFindByPIdDto: BaseFindByPIdDto): Promise<any> {
    return this.areaService.selectTree(baseFindByPIdDto);
  }

  @Get('findById')
  @Permissions('system:area:findById')
  @ApiOperation({ summary: '获取详情（主键 id）' })
  async findById(@Query() id: string): Promise<Area> {
    return await this.areaService.selectById(id);
  }
}
