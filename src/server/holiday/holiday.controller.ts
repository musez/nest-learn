import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
  BadRequestException,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import {
  FileInterceptor,
  FilesInterceptor,
  FileFieldsInterceptor,
} from '@nestjs/platform-express';
import { HolidayService } from './holiday.service';
import { CreateHolidayDto } from './dto/create-holiday.dto';
import { UpdateHolidayDto } from './dto/update-holiday.dto';
import { ApiBasicAuth, ApiBody, ApiConsumes, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CurUser } from '../../common/decorators/cur-user.decorator';
import { Auth } from '../../common/decorators/auth.decorator';
import { BaseFindByIdDto, BaseFindByIdsDto, BaseModifyStatusByIdsDto } from '../base.dto';
import { Holiday } from './entities/holiday.entity';
import { SearchHolidayDto } from './dto/search-holiday.dto';
import { LimitHolidayDto } from './dto/limit-holiday.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthGuard } from '../../common/guards/auth.guard';
import { Utils } from '../../utils';
import { BaseDaysDto } from './dto/base-holiday.dto';
import { ExcelService } from '../excel/excel.service';

@Controller('holiday')
@ApiTags('节假日')
@ApiBasicAuth('token')
@UseGuards(JwtAuthGuard, AuthGuard)
export class HolidayController {
  constructor(
    private readonly holidayService: HolidayService,
    private readonly excelService: ExcelService,
  ) {
  }

  @Post('add')
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
    const { days } = baseDaysDto;
    const dayList = Utils.dayjsGetDay(parseInt(String(days)));
    return this.holidayService.selectDays(dayList, curUser);
  }

  @Post('importExcel')
  @Auth('holiday:user:importExcel')
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
    const columns = [
      { key: 'name', name: '名称', type: 'String', size: 10 },
      { key: 'date', name: '日期', type: 'String', size: 20 },
      { key: 'weekday', name: '周几', type: 'Number', size: 10 },
      { key: 'restType', name: '类型', type: 'Number', size: 10 },
    ];
    const rows = await this.excelService.importExcel(columns, file);
    return await this.holidayService.insertBatch(rows, curUser);
  }

  @Post('update')
  @Auth('system:holiday:update')
  @ApiOperation({ summary: '修改' })
  async update(@CurUser() curUser, @Body() updateHolidayDto: UpdateHolidayDto): Promise<any> {
    const { id } = updateHolidayDto;

    const isExistId = await this.holidayService.isExistId(id);
    if (!isExistId) {
      throw new BadRequestException(`数据 id：${id} 不存在！`);
    }

    return this.holidayService.update(updateHolidayDto, curUser);
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
    const { id } = baseFindByIdDto;

    const isExistId = await this.holidayService.isExistId(id);
    if (!isExistId) {
      throw new BadRequestException(`数据 id：${id} 不存在！`);
    }

    return await this.holidayService.deleteById(baseFindByIdDto, curUser);
  }

  @Post('deleteBatch')
  @Auth('system:holiday:deleteBatch')
  @ApiOperation({ summary: '删除（批量）' })
  async deleteBatch(@CurUser() curUser, @Body() baseFindByIdsDto: BaseFindByIdsDto): Promise<any> {
    return await this.holidayService.deleteByIds(baseFindByIdsDto, curUser);
  }
}
