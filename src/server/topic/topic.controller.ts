import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Query,
  Res,
} from '@nestjs/common';
import { TopicService } from './topic.service';
import { CreateTopicDto } from './dto/create-topic.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';
import { ApiBasicAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthGuard } from '../../common/guards/auth.guard';
import { Auth } from '../../common/decorators/auth.decorator';
import { CurUser } from '../../common/decorators/cur-user.decorator';
import { BaseFindByIdDto, BaseFindByIdsDto, BaseModifyStatusByIdsDto } from '../base.dto';
import { Utils } from '../../utils';
import { ExcelService } from '../excel/excel.service';
import { SearchTopicDto } from './dto/search-top.dto';
import { Topic } from './entities/topic.entity';
import { LimitTopicDto } from './dto/limit-top.dto';
import { ApiException } from '../../common/exception/api-exception';
import { TopicStatusDict } from '../../constants/dicts.const';

@ApiTags('评论')
@Controller('topic')
@ApiBasicAuth('token')
@UseGuards(JwtAuthGuard, AuthGuard)
export class TopicController {
  constructor(
    private readonly topicService: TopicService,
    private readonly excelService: ExcelService,
  ) {
  }

  @Post('add')
  @Auth('system:topic:add')
  @ApiOperation({ summary: '添加' })
  async add(@CurUser() curUser, @Body() createTopicDto: CreateTopicDto) {
    return this.topicService.insert(createTopicDto, curUser);
  }

  @Get('findList')
  @Auth('system:topic:findList')
  @ApiOperation({ summary: '获取列表' })
  async findList(@Query() searchTopicDto: SearchTopicDto): Promise<Topic[]> {
    return await this.topicService.selectList(searchTopicDto);
  }

  @Get('findListPage')
  @Auth('system:topic:findListPage')
  @ApiOperation({ summary: '获取列表（分页）' })
  async findListPage(@Query() limitTopicDto: LimitTopicDto): Promise<any> {
    return await this.topicService.selectListPage(limitTopicDto);
  }

  @Get('findById')
  @Auth('system:topic:findById')
  @ApiOperation({ summary: '获取详情（主键 id）' })
  async findById(@Query() baseFindByIdDto: BaseFindByIdDto): Promise<Topic> {
    return await this.topicService.selectById(baseFindByIdDto);
  }

  @Get('exportExcel')
  @Auth('system:topic:exportExcel')
  @ApiOperation({ summary: '列表（Excel 导出）' })
  async exportExcel(@Query() searchTopicDto: SearchTopicDto, @Res() res): Promise<any> {
    const list = await this.topicService.selectList(searchTopicDto);

    const columns = [
      { key: 'topicId', name: '主题 id', type: 'String', size: 10 },
      { key: 'topicType', name: '主题类型', type: 'String', size: 10 },
      { key: 'content', name: '评论内容', type: 'String', size: 20 },
      { key: 'fromUid', name: '评论用户 id', type: 'String', size: 10 },
      { key: 'status', name: '状态', type: 'Enum', size: 10, default: TopicStatusDict },
      { key: 'description', name: '评论用户', type: 'String', size: 20 },
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
      encodeURIComponent(`文章评论_${Utils.dayjsFormat('YYYYMMDD')}`) +
      '.xlsx', // 中文名需要进行 url 转码
    );
    // res.setTimeout(30 * 60 * 1000); // 防止网络原因造成超时。
    res.end(result, 'binary');
  }

  @Post('update')
  @Auth('system:topic:update')
  @ApiOperation({ summary: '修改' })
  async update(@CurUser() curUser, @Body() updateTopicDto: UpdateTopicDto): Promise<any> {
    const { id } = updateTopicDto;
    const isExistId = await this.topicService.isExistId(id);
    if (!isExistId) {
      throw new ApiException(`数据 id：${id} 不存在！`, 404);
    }

    return this.topicService.update(updateTopicDto, curUser);
  }

  @Post('pass')
  @Auth('system:topic:pass')
  @ApiOperation({ summary: '审核通过' })
  async pass(@CurUser() curUser, @Body() baseFindByIdDto: BaseFindByIdDto): Promise<any> {
    const { id } = baseFindByIdDto;
    return this.topicService.updateStatus({ ids: id, status: 1 }, curUser);
  }

  @Post('reject')
  @Auth('system:topic:reject')
  @ApiOperation({ summary: '审核驳回' })
  async reject(@CurUser() curUser, @Body() baseFindByIdDto: BaseFindByIdDto): Promise<any> {
    const { id } = baseFindByIdDto;
    return this.topicService.updateStatus({ ids: id, status: 2 }, curUser);
  }

  @Post('updateStatus')
  @Auth('system:topic:updateStatus')
  @ApiOperation({ summary: '修改状态' })
  async updateStatus(@CurUser() curUser, @Body() baseModifyStatusByIdsDto: BaseModifyStatusByIdsDto): Promise<any> {
    return this.topicService.updateStatus(baseModifyStatusByIdsDto, curUser);
  }

  @Post('delete')
  @Auth('system:topic:delete')
  @ApiOperation({ summary: '删除' })
  async delete(@CurUser() curUser, @Body() baseFindByIdDto: BaseFindByIdDto): Promise<any> {
    const { id } = baseFindByIdDto;
    const isExistId = await this.topicService.isExistId(id);

    if (!isExistId) {
      throw new ApiException(`数据 id：${id} 不存在！`, 404);
    }

    return await this.topicService.deleteById(baseFindByIdDto, curUser);
  }

  @Post('deleteBatch')
  @Auth('system:topic:deleteBatch')
  @ApiOperation({ summary: '删除（批量）' })
  async deleteBatch(@CurUser() curUser, @Body() baseFindByIdsDto: BaseFindByIdsDto): Promise<any> {
    return await this.topicService.deleteByIds(baseFindByIdsDto, curUser);
  }
}
