import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
  Query,
  Res,
  BadRequestException,
} from '@nestjs/common';
import { TopicService } from './topic.service';
import { CreateTopicDto } from './dto/create-topic.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';
import { ApiBasicAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthGuard } from '../../common/guards/auth.guard';
import { Auth } from '../../common/decorators/auth.decorator';
import { CurUser } from '../../common/decorators/cur-user.decorator';
import { BaseFindByIdDto } from '../base.dto';
import { Utils } from '../../utils';
import { ExcelService } from '../excel/excel.service';
import { SearchTopicDto } from './dto/search-top.dto';
import { Topic } from './entities/topic.entity';
import { LimitTopicDto } from './dto/limit-top.dto';

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
  @Auth('system:topic:findList')
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
  @Auth('account:topic:exportExcel')
  @ApiOperation({ summary: '列表（Excel 导出）' })
  async exportExcel(@Query() searchTopicDto: SearchTopicDto, @Res() res): Promise<any> {
    const list = await this.topicService.selectList(searchTopicDto);

    const columns = [
      // { key: 'title', name: '标题', type: 'String', size: 10 },
      // { key: 'summary', name: '摘要', type: 'String', size: 10 },
      // { key: 'author', name: '作者', type: 'String', size: 10 },
      // { key: 'source', name: '来源', type: 'String', size: 10 },
      // { key: 'keywords', name: '关键字', type: 'String', size: 10 },
      // { key: 'type', name: '文章类型', type: 'Enum', size: 10, default: ArticleDict },
      // { key: 'contentUrl', name: '链接', type: 'String', size: 10 },
      // { key: 'status', name: '状态', type: 'Enum', size: 10, default: StatusType },
      // { key: 'description', name: '备注', type: 'String', size: 20 },
      // { key: 'createTime', name: '创建时间', type: 'String', size: 20 },
      // { key: 'updateTime', name: '修改时间', type: 'String', size: 20 },
    ];
    const result = await this.excelService.exportExcel(columns, list);

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats;charset=utf-8',
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=' + encodeURIComponent(`文章_${Utils.dayjsFormat('YYYYMMDD')}`) + '.xlsx',// 中文名需要进行 url 转码
    );
    res.setTimeout(30 * 60 * 1000); // 防止网络原因造成超时。
    res.end(result, 'binary');
  }

  @Post('update')
  @Auth('system:topic:update')
  @ApiOperation({ summary: '修改' })
  async update(@CurUser() curUser, @Body() updateTopicDto: UpdateTopicDto): Promise<any> {
    const { id } = updateTopicDto;
    const isExistId = await this.topicService.isExistId(id);
    if (!isExistId) {
      throw new BadRequestException(`数据 id：${id} 不存在！`);
    }

    return this.topicService.update(updateTopicDto, curUser);
  }
}
