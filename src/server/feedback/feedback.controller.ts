import { Controller, Get, Post, Body, UseGuards, Query, Res, HttpStatus } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { Feedback } from './entities/feedback.entity';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { SearchFeedbackDto } from './dto/search-feedback.dto';
import { LimitFeedbackDto } from './dto/limit-feedback.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthGuard } from '../../common/guards/auth.guard';
import { ApiBasicAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ExcelService } from '../excel/excel.service';
import { Auth } from '../../common/decorators/auth.decorator';
import { BaseFindByIdDto, BaseFindByIdsDto, BaseModifyStatusByIdsDto } from '../base.dto';
import { CurUser } from '../../common/decorators/cur-user.decorator';
import { ApiException } from '../../common/exception/api-exception';
import {
  BusinessDict,
  FeedbackStatusDict,
  FeedbackDict,
} from '../../constants/dicts.const';
import { Utils } from '../../utils';
import { ApiErrorCode } from '../../constants/api-error-code.enum';

@ApiTags('建议反馈')
@Controller('feedback')
@ApiBasicAuth('token')
@UseGuards(JwtAuthGuard, AuthGuard)
export class FeedbackController {
  constructor(
    private readonly feedbackService: FeedbackService,
    private readonly excelService: ExcelService,
  ) {
  }

  @Post('add')
  @Auth('account:feedback:add')
  @ApiOperation({ summary: '添加' })
  create(@Body() createFeedbackDto: CreateFeedbackDto) {
    return this.feedbackService.insert(createFeedbackDto);
  }

  @Get('findList')
  @Auth('account:feedback:findList')
  @ApiOperation({ summary: '获取列表' })
  findList(@Query() searchFeedbackDto: SearchFeedbackDto) {
    return this.feedbackService.selectList(searchFeedbackDto);
  }

  @Get('findListPage')
  @Auth('account:feedback:findListPage')
  @ApiOperation({ summary: '获取列表（分页）' })
  async findListPage(@Query() limitFeedbackDto: LimitFeedbackDto): Promise<any> {
    return await this.feedbackService.selectListPage(limitFeedbackDto);
  }

  @Get('findById')
  @Auth('account:feedback:findById')
  @ApiOperation({ summary: '获取详情（主键 id）' })
  async findById(@Query() baseFindByIdDto: BaseFindByIdDto): Promise<Feedback> {
    return await this.feedbackService.selectById(baseFindByIdDto);
  }

  @Get('exportExcel')
  @Auth('account:feedback:exportExcel')
  @ApiOperation({ summary: '列表（Excel 导出）' })
  async exportExcel(@Query() searchFeedbackDto: SearchFeedbackDto, @Res() res): Promise<any> {
    try {
      const list = await this.feedbackService.selectList(searchFeedbackDto);

      const columns = [

        { key: 'name', name: '姓名', type: 'String', size: 10 },
        { key: 'mobile', name: '手机号', type: 'String', size: 15 },
        { key: 'email', name: '邮箱', type: 'String', size: 15 },
        { key: 'userType', name: '建议反馈类型', type: 'Enum', size: 10, default: FeedbackDict },
        { key: 'userType', name: '业务类型', type: 'Enum', size: 10, default: BusinessDict },
        { key: 'content', name: '内容', type: 'String', size: 20 },
        { key: 'status', name: '状态', type: 'Enum', size: 10, default: FeedbackStatusDict },
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
        encodeURIComponent(`用户_${Utils.dayjsFormat('YYYYMMDD')}`) +
        '.xlsx', // 中文名需要进行 url 转码
      );
      // res.setTimeout(30 * 60 * 1000); // 防止网络原因造成超时。
      res.end(result, 'binary');
    } catch (e) {
       throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  @Post('pass')
  @Auth('system:feedback:pass')
  @ApiOperation({ summary: '处理' })
  async pass(@CurUser() curUser, @Body() baseFindByIdDto: BaseFindByIdDto): Promise<any> {
    try {
      const { id } = baseFindByIdDto;
      return this.feedbackService.updateStatus({ ids: id, status: 1 }, curUser);
    } catch (e) {
       throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  @Post('reject')
  @Auth('system:feedback:reject')
  @ApiOperation({ summary: '忽略' })
  async reject(@CurUser() curUser, @Body() baseFindByIdDto: BaseFindByIdDto): Promise<any> {
    try {
      const { id } = baseFindByIdDto;
      return this.feedbackService.updateStatus({ ids: id, status: 2 }, curUser);
    } catch (e) {
       throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  @Post('updateStatus')
  @Auth('account:feedback:updateStatus')
  @ApiOperation({ summary: '修改状态（批量，主键 ids）' })
  async updateStatus(@CurUser() curUser, @Body() baseModifyStatusByIdsDto: BaseModifyStatusByIdsDto): Promise<any> {
    return this.feedbackService.updateStatus(baseModifyStatusByIdsDto, curUser);
  }

  @Post('delete')
  @Auth('account:feedback:delete')
  @ApiOperation({ summary: '删除（主键 id）' })
  async delete(@CurUser() curUser, @Body() baseFindByIdDto: BaseFindByIdDto): Promise<any> {
    try {
      const { id } = baseFindByIdDto;

      const isExistId = await this.feedbackService.isExistId(id);
      if (!isExistId) {
        throw new ApiException(`数据 id：${id} 不存在！`, ApiErrorCode.NOT_FOUND, HttpStatus.OK);
      }

      return await this.feedbackService.deleteById(baseFindByIdDto, curUser);
    } catch (e) {
       throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  @Post('deleteBatch')
  @Auth('system:feedback:deleteBatch')
  @ApiOperation({ summary: '删除（批量，主键 ids）' })
  async deleteBatch(@CurUser() curUser, @Body() baseFindByIdsDto: BaseFindByIdsDto): Promise<any> {
    try {
      return await this.feedbackService.deleteByIds(baseFindByIdsDto, curUser);
    } catch (e) {
       throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }
}
