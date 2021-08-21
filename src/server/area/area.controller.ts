import { Controller, Get, Query, UseGuards, Res } from '@nestjs/common';
import { ApiTags, ApiBasicAuth, ApiOperation } from '@nestjs/swagger';
import { AreaService } from './area.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Area } from './entities/area.entity';
import { LimitAreaDto } from './dto/limit-area.dto';
import { BaseFindByPIdDto } from '../base.dto';
import { SearchAreaDto } from './dto/search-area.dto';
import { Auth } from '../../common/decorators/auth.decorator';
import { AuthGuard } from '../../common/guards/auth.guard';
import { Utils } from '../../utils';
import { ExcelService } from '../excel/excel.service';
import { AreaLevelDict } from '../../constants/dicts';

@Controller('area')
@ApiTags('地区')
@ApiBasicAuth('token')
@UseGuards(JwtAuthGuard, AuthGuard)
export class AreaController {
  constructor(
    private readonly areaService: AreaService,
    private readonly excelService: ExcelService,
  ) {}

  @Get('findList')
  @Auth('system:area:findList')
  @ApiOperation({ summary: '获取列表（默认返回 []）' })
  async findList(@Query() searchAreaDto: SearchAreaDto): Promise<Area[]> {
    const { parentId, areaName } = searchAreaDto;

    if (Utils.isBlank(parentId) && Utils.isBlank(areaName)) {
      return [];
    }

    return await this.areaService.selectList(searchAreaDto);
  }

  @Get('findListPage')
  @Auth('system:area:findListPage')
  @ApiOperation({ summary: '获取列表（分页）' })
  async findListPage(@Query() limitAreaDto: LimitAreaDto): Promise<any> {
    return await this.areaService.selectListPage(limitAreaDto);
  }

  @Get('findListByPId')
  @Auth('system:area:findListByPId')
  @ApiOperation({ summary: '获取子代列表（父 id）' })
  async findListByPId(
    @Query() baseFindByPIdDto: BaseFindByPIdDto,
  ): Promise<any> {
    return this.areaService.selectListByPId(baseFindByPIdDto);
  }

  @Get('findTree')
  @Auth('system:area:findTree')
  @ApiOperation({ summary: '获取树' })
  async findTree(@Query() baseFindByPIdDto: BaseFindByPIdDto): Promise<any> {
    return this.areaService.selectTree(baseFindByPIdDto);
  }

  @Get('findById')
  @Auth('system:area:findById')
  @ApiOperation({ summary: '获取详情（主键 id）' })
  async findById(@Query() id: string): Promise<Area> {
    return await this.areaService.selectById(id);
  }

  @Get('exportExcel')
  @Auth('account:area:exportExcel')
  @ApiOperation({ summary: '列表（Excel 导出）' })
  async exportExcel(
    @Query() searchAreaDto: SearchAreaDto,
    @Res() res,
  ): Promise<any> {
    const list = await this.areaService.selectList(searchAreaDto);

    const columns = [
      { key: 'areaName', name: '地区名称', type: 'String', size: 10 },
      { key: 'areaCode', name: '地区编码', type: 'String', size: 10 },
      {
        key: 'level',
        name: '地区级别',
        type: 'Enum',
        size: 10,
        default: AreaLevelDict,
      },
      { key: 'cityCode', name: '城市编码', type: 'String', size: 10 },
      { key: 'center', name: '城市中心点', type: 'String', size: 10 },
      { key: 'createTime', name: '创建时间', type: 'String', size: 20 },
      { key: 'updateTime', name: '修改时间', type: 'String', size: 20 },
    ];
    const result = await this.excelService.exportExcel(columns, list);

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats;charset=utf-8',
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=' +
        encodeURIComponent(`地区_${Utils.dayjsFormat('YYYYMMDD')}`) +
        '.xlsx', // 中文名需要进行 url 转码
    );
    // res.setTimeout(30 * 60 * 1000); // 防止网络原因造成超时。
    res.end(result, 'binary');
  }
}
