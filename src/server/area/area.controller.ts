import {
  Controller,
  Get,
  Query,
  UseGuards,
  Res,
  Post,
  UseInterceptors,
  UploadedFile,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiBasicAuth, ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';
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
import { AreaLevelDict, SexDict, StatusDict, UserDict } from '../../constants/dicts.const';
import { FileInterceptor } from '@nestjs/platform-express';
import { CurUser } from '../../common/decorators/cur-user.decorator';
import { ApiException } from '../../common/exception/api-exception';
import { ImportLogService } from '../import-log/import-log.service';
import { ImportType } from '../../constants/dicts.enum';
import { ApiErrorCode } from '../../constants/api-error-code.enum';

@Controller('area')
@ApiTags('地区')
@ApiBasicAuth('token')
@UseGuards(JwtAuthGuard, AuthGuard)
export class AreaController {
  constructor(
    private readonly areaService: AreaService,
    private readonly excelService: ExcelService,
    private readonly importLogService: ImportLogService,
  ) {
  }

  @Get('findList')
  @Auth('system:area:findList')
  @ApiOperation({ summary: '获取列表（默认返回 []）' })
  async findList(@Query() searchAreaDto: SearchAreaDto): Promise<Area[]> {
    try {
      const { parentId, areaName } = searchAreaDto;

      if (Utils.isBlank(parentId) && Utils.isBlank(areaName)) {
        return [];
      }

      return await this.areaService.selectList(searchAreaDto);
    } catch (e) {
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
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
  async findListByPId(@Query() baseFindByPIdDto: BaseFindByPIdDto): Promise<any> {
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
  async exportExcel(@Query() searchAreaDto: SearchAreaDto, @Res() res): Promise<any> {
    try {
      const list = await this.areaService.selectList(searchAreaDto);

      const columns = [
        { key: 'areaName', name: '地区名称', type: 'String', size: 10 },
        { key: 'areaCode', name: '地区编码', type: 'String', size: 10 },
        { key: 'level', name: '地区级别', type: 'Enum', size: 10, default: AreaLevelDict },
        { key: 'cityCode', name: '城市编码', type: 'String', size: 10 },
        { key: 'center', name: '城市中心点', type: 'String', size: 10 },
        { key: 'long', name: '经度', type: 'String', size: 10 },
        { key: 'lat', name: '纬度', type: 'String', size: 10 },
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
    } catch (e) {
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  @Post('importExcel')
  @Auth('system:area:importExcel')
  @ApiOperation({ summary: '列表（Excel 导入）' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: '文件',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async importExcel(@CurUser() curUser, @UploadedFile() file): Promise<any> {
    try {
      const columns = [
        { key: 'areaName', name: '地区名称', type: 'String', index: 1 },
        { key: 'areaCode', name: '地区编码', type: 'String', index: 2 },
        { key: 'level', name: '地区级别', type: 'Enum', enum: AreaLevelDict, index: 3 },
        { key: 'cityCode', name: '城市编码', type: 'String', index: 4 },
        { key: 'center', name: '城市中心点', type: 'String', index: 5 },
        { key: 'long', name: '经度', type: 'String', index: 6 },
        { key: 'lat', name: '纬度', type: 'String', index: 7 },
      ];

      const rows = await this.excelService.importExcel(columns, file);
      const successRows = [],
        errorRows = [];

      for (const item of rows) {
        const { areaCode } = item;
        const ret = await this.areaService.isExistAreaCode(areaCode);
        if (ret) {
          item.errorMsg = `数据 地区编码（areaCode）：${areaCode} 已存在！`;
          errorRows.push(item);
          continue;
        }

        successRows.push(item);
      }

      const ret = await this.areaService.insertBatch(successRows, curUser);
      const retLog = await this.importLogService.insert({
        importType: ImportType.AREA,
        successCount: successRows.length,
        successData: successRows.length ? JSON.stringify(successRows) : null,
        errorCount: errorRows.length,
        errorData: errorRows.length ? JSON.stringify(errorRows) : null,
      }, curUser);

      if (ret && retLog) {
        return {
          successList: successRows,
          successCount: successRows.length,
          errorList: errorRows,
          errorCount: errorRows.length,
        };
      } else {
        throw new ApiException(`操作异常！`, ApiErrorCode.ERROR, HttpStatus.OK);
      }
    } catch (e) {
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }
}
