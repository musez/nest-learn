import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Res, HttpStatus,
} from '@nestjs/common';
import {
  FileInterceptor,
} from '@nestjs/platform-express';
import * as dayjs from 'dayjs';
import { HolidayService } from './holiday.service';
import { CreateHolidayDto } from './dto/create-holiday.dto';
import { UpdateHolidayDto } from './dto/update-holiday.dto';
import {
  ApiBasicAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CurUser } from '../../common/decorators/cur-user.decorator';
import { Auth } from '../../common/decorators/auth.decorator';
import {
  BaseFindByIdDto,
  BaseFindByIdsDto,
  BaseModifyStatusByIdsDto,
} from '../base.dto';
import { Holiday } from './entities/holiday.entity';
import { SearchHolidayDto } from './dto/search-holiday.dto';
import { LimitHolidayDto } from './dto/limit-holiday.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthGuard } from '../../common/guards/auth.guard';
import { Utils } from '../../utils';
import { BaseDaysDto } from './dto/base-holiday.dto';
import { ExcelService } from '../excel/excel.service';
import { RestDict, StatusDict, WeekdayDict } from '../../constants/dicts.const';
import { ApiException } from '../../common/exception/api-exception';
import { ApiErrorCode } from '../../constants/api-error-code.enum';
import { ImportType } from '../../constants/dicts.enum';
import { ImportLogService } from '../import-log/import-log.service';

@Controller('holiday')
@ApiTags('节假日')
@ApiBasicAuth('token')
@UseGuards(JwtAuthGuard, AuthGuard)
export class HolidayController {
  constructor(
    private readonly holidayService: HolidayService,
    private readonly excelService: ExcelService,
    private readonly importLogService: ImportLogService,
  ) {
  }

  @Post('add')
  @Auth('system:holiday:add')
  @ApiOperation({ summary: '添加' })
  async add(@CurUser() curUser, @Body() createHolidayDto: CreateHolidayDto): Promise<CreateHolidayDto> {
    return this.holidayService.insert(createHolidayDto, curUser);
  }

  @Get('findList')
  @Auth('system:holiday:findList')
  @ApiOperation({ summary: '获取列表' })
  async findList(@Query() searchHolidayDto: SearchHolidayDto): Promise<Holiday[]> {
    return await this.holidayService.selectList(searchHolidayDto);
  }

  @Get('findListPage')
  @Auth('system:holiday:findListPage')
  @ApiOperation({ summary: '获取列表（分页）' })
  async findListPage(@Query() limitHolidayDto: LimitHolidayDto): Promise<any> {
    return await this.holidayService.selectListPage(limitHolidayDto);
  }

  @Get('findById')
  @Auth('system:holiday:findById')
  @ApiOperation({ summary: '获取详情（主键 id）' })
  async findById(@Query() baseFindByIdDto: BaseFindByIdDto): Promise<Holiday> {
    return await this.holidayService.selectById(baseFindByIdDto);
  }

  @Get('getDays')
  @Auth('system:holiday:getDays')
  @ApiOperation({ summary: '获取 n 天内的日期' })
  async getDays(@CurUser() curUser, @Query() baseDaysDto: BaseDaysDto): Promise<any> {
    try {
      const { days } = baseDaysDto;
      const dayList = Utils.dayjsGetDay(parseInt(String(days)));
      return this.holidayService.selectDays(dayList, curUser);
    } catch (e) {
      throw new ApiException(e.message, ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  @Get('exportExcel')
  @Auth('system:holiday:exportExcel')
  @ApiOperation({ summary: '列表（Excel 导出）' })
  async exportExcel(@Query() searchDto: SearchHolidayDto, @Res() res): Promise<any> {
    try {
      const list = await this.holidayService.selectList(searchDto);

      const columns = [
        { key: 'name', name: '名称', type: 'String', size: 10 },
        { key: 'date', name: '日期', type: 'String', size: 10 },
        { key: 'weekday', name: '周几', type: 'Enum', size: 10, default: WeekdayDict },
        { key: 'restType', name: '类型', type: 'Enum', size: 10, default: RestDict },
        { key: 'status', name: '状态', type: 'Enum', size: 10, default: StatusDict },
        { key: 'description', name: '备注', type: 'String', size: 20 },
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
        encodeURIComponent(`节假日_${Utils.dayjsFormat('YYYYMMDD')}`) +
        '.xlsx', // 中文名需要进行 url 转码
      );
      // res.setTimeout(30 * 60 * 1000); // 防止网络原因造成超时。
      res.end(result, 'binary');
    } catch (e) {
      throw new ApiException(e.message, ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  @Post('importExcel')
  @Auth('system:holiday:importExcel')
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
        { key: 'name', name: '名称', type: 'String', size: 10, index: 1 },
        { key: 'date', name: '日期', type: 'String', size: 10, index: 2 },
        { key: 'weekday', name: '周几', type: 'Enum', size: 10, enum: WeekdayDict, index: 3 },
        { key: 'restType', name: '类型', type: 'Enum', size: 10, enum: RestDict, index: 4 },
        { key: 'status', name: '状态', type: 'Enum', size: 10, enum: StatusDict, index: 5 },
        { key: 'description', name: '备注', type: 'String', size: 20, index: 6 },
      ];

      const rows = await this.excelService.importExcel(columns, file);
      // 自动获取周几
      rows.forEach((v) => {
        if (v.date) {
          v.weekday = dayjs(v.date).day();
        }
      });
      const successRows = [],
        errorRows = [];

      for (const item of rows) {
        const { date, restType } = item;

        if (!date) {
          item.errorMsg = `数据 日期（date） 不能为空！`;
          errorRows.push(item);
          continue;
        }

        if (!restType) {
          item.errorMsg = `数据 类型（restType） 不能为空！`;
          errorRows.push(item);
          continue;
        }

        successRows.push(item);
      }

      const ret = await this.holidayService.insertBatch(rows, curUser);
      const retLog = await this.importLogService.insert({
        importType: ImportType.HOLIDAY,
        successCount: successRows.length,
        successData: successRows.length ? JSON.stringify(successRows) : null,
        errorCount: errorRows.length,
        errorData: errorRows.length ? JSON.stringify(errorRows) : null,
      }, curUser);

      if (ret && retLog) {
        return {
          successList: successRows,
          successCount: ret.length,
          errorList: errorRows,
          errorCount: ret.length,
        };
      } else {
        throw new ApiException(`操作异常！`, ApiErrorCode.ERROR, HttpStatus.OK);
      }
    } catch (e) {
      throw new ApiException(e.message, ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  @Post('update')
  @Auth('system:holiday:update')
  @ApiOperation({ summary: '修改' })
  async update(@CurUser() curUser, @Body() updateHolidayDto: UpdateHolidayDto): Promise<any> {
    try {
      const { id } = updateHolidayDto;

      const isExistId = await this.holidayService.isExistId(id);
      if (!isExistId) {
        throw new ApiException(`数据 id：${id} 不存在！`, ApiErrorCode.NOT_FOUND, HttpStatus.OK);
      }

      return this.holidayService.update(updateHolidayDto, curUser);
    } catch (e) {
      throw new ApiException(e.message, ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  @Post('updateStatus')
  @Auth('system:holiday:updateStatus')
  @ApiOperation({ summary: '修改状态' })
  async updateStatus(@CurUser() curUser, @Body() baseModifyStatusByIdsDto: BaseModifyStatusByIdsDto): Promise<any> {
    return this.holidayService.updateStatus(baseModifyStatusByIdsDto, curUser);
  }

  @Post('delete')
  @Auth('system:holiday:delete')
  @ApiOperation({ summary: '删除' })
  async delete(@CurUser() curUser, @Body() baseFindByIdDto: BaseFindByIdDto): Promise<any> {
    try {
      const { id } = baseFindByIdDto;

      const isExistId = await this.holidayService.isExistId(id);
      if (!isExistId) {
        throw new ApiException(`数据 id：${id} 不存在！`, ApiErrorCode.NOT_FOUND, HttpStatus.OK);
      }

      return await this.holidayService.deleteById(baseFindByIdDto, curUser);
    } catch (e) {
      throw new ApiException(e.message, ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  @Post('deleteBatch')
  @Auth('system:holiday:deleteBatch')
  @ApiOperation({ summary: '删除（批量）' })
  async deleteBatch(@CurUser() curUser, @Body() baseFindByIdsDto: BaseFindByIdsDto): Promise<any> {
    return await this.holidayService.deleteByIds(baseFindByIdsDto, curUser);
  }
}
