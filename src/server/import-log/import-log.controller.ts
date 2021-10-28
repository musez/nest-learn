import { Controller, Get, UseGuards, Query, Res } from '@nestjs/common';
import { ImportLogService } from './import-log.service';
import { CreateImportLogDto } from './dto/create-import-log.dto';
import { UpdateImportLogDto } from './dto/update-import-log.dto';
import { ApiBasicAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthGuard } from '../../common/guards/auth.guard';
import { Auth } from '../../common/decorators/auth.decorator';
import { LimitImportLogDto } from './dto/limit-import-log.dto';
import { SearchImportLogDto } from './dto/search-import-log.dto';
import { ImportLog } from './entities/import-log.entity';
import { DownloadImportLogDto } from './dto/download-import-log.dto';
import { ImportType } from '../../constants/dicts.enum';
import {
  AreaLevelDict,
  ImportDict,
  RestDict,
  SexDict,
  StatusDict,
  UserDict,
  WeekdayDict,
} from '../../constants/dicts.const';
import { Utils } from '../../utils';
import { ExcelService } from '../excel/excel.service';

@Controller('importLog')
@ApiTags('导入日志')
@ApiBasicAuth('token')
@UseGuards(JwtAuthGuard, AuthGuard)
export class ImportLogController {
  constructor(
    private readonly importLogService: ImportLogService,
    private readonly excelService: ExcelService,
  ) {
  }

  @Get('findList')
  @Auth('system:importLog:findList')
  @ApiOperation({ summary: '获取列表' })
  async findList(@Query() searchImportLogDto: SearchImportLogDto): Promise<ImportLog[]> {
    return await this.importLogService.selectList(searchImportLogDto);
  }

  @Get('findListPage')
  @Auth('system:importLog:findListPage')
  @ApiOperation({ summary: '获取列表（分页）' })
  async findListPage(@Query() limitImportLogDto: LimitImportLogDto): Promise<any> {
    return await this.importLogService.selectListPage(limitImportLogDto);
  }

  @Get('download')
  @Auth('system:importLog:download')
  @ApiOperation({ summary: '下载失败数据' })
  async download(@Query() downloadImportLogDto: DownloadImportLogDto, @Res() res): Promise<any> {
    const { id, importType } = downloadImportLogDto;
    const { errorData } = await this.importLogService.selectById({ id });

    let columns = [];
    if (Number(importType) === ImportType.AREA) {
      columns = [
        { key: 'id', name: 'id', type: 'String', size: 10 },
        { key: 'parentId', name: '父 id', type: 'String', size: 10 },
        { key: 'areaName', name: '地区名称', type: 'String', size: 10 },
        { key: 'areaCode', name: '地区编码', type: 'String', size: 10 },
        { key: 'level', name: '地区级别', type: 'Enum', size: 10, default: AreaLevelDict },
        { key: 'cityCode', name: '城市编码', type: 'String', size: 10 },
        { key: 'center', name: '城市中心点', type: 'String', size: 10 },
        { key: 'long', name: '经度', type: 'String', size: 10 },
        { key: 'lat', name: '纬度', type: 'String', size: 10 },
        { key: 'errorMsg', name: '失败原因', type: 'String', size: 20 },
      ];
    } else if (Number(importType) === ImportType.HOLIDAY) {
      columns = [
        { key: 'name', name: '名称', type: 'String', size: 10 },
        { key: 'date', name: '日期', type: 'String', size: 10 },
        { key: 'weekday', name: '周几', type: 'Enum', size: 10, default: WeekdayDict },
        { key: 'restType', name: '类型', type: 'Enum', size: 10, default: RestDict },
        { key: 'status', name: '状态', type: 'Enum', size: 10, default: StatusDict },
        { key: 'description', name: '备注', type: 'String', size: 20 },
        { key: 'errorMsg', name: '失败原因', type: 'String', size: 20 },
      ];
    } else if (Number(importType) === ImportType.USER) {
      columns = [
        { key: 'userName', name: '用户名', type: 'String', size: 10 },
        { key: 'userType', name: '用户类型', type: 'Enum', size: 10, default: UserDict },
        { key: 'name', name: '姓名', type: 'String', size: 10 },
        { key: 'mobile', name: '手机号', type: 'String', size: 15 },
        { key: 'email', name: '邮箱', type: 'String', size: 15 },
        { key: 'sex', name: '性别', type: 'Enum', size: 10, default: SexDict },
        { key: 'birthday', name: '生日', type: 'String', size: 15 },
        { key: 'provinceId', name: '省份', type: 'String', size: 15 },
        { key: 'cityId', name: '城市', type: 'String', size: 15 },
        { key: 'districtId', name: '区/县', type: 'String', size: 15 },
        { key: 'address', name: '详细地址', type: 'String', size: 30 },
        { key: 'status', name: '状态', type: 'Enum', size: 10, default: StatusDict },
        { key: 'description', name: '备注', type: 'String', size: 20 },
        { key: 'errorMsg', name: '失败原因', type: 'String', size: 20 },
      ];
    }
    console.log('columns',columns);
    console.log('errorData',JSON.parse(errorData));
    const result = await this.excelService.exportExcel(columns, JSON.parse(errorData));
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats;charset=utf-8',
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=' +
      encodeURIComponent(`${ImportDict[importType]}失败数据_${Utils.dayjsFormat('YYYYMMDD')}`) +
      '.xlsx', // 中文名需要进行 url 转码
    );
    // res.setTimeout(30 * 60 * 1000); // 防止网络原因造成超时。
    res.end(result, 'binary');
  }
}
