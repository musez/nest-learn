import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { ApiBasicAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ExcelService } from '../excel/excel.service';
import { Auth } from '../../common/decorators/auth.decorator';
import { CurUser } from '../../common/decorators/cur-user.decorator';
import { CreateTopicDto } from '../topic/dto/create-topic.dto';
import { SearchTopicDto } from '../topic/dto/search-top.dto';
import { Topic } from '../topic/entities/topic.entity';
import { LimitTopicDto } from '../topic/dto/limit-top.dto';
import { BaseFindByIdDto, BaseFindByIdsDto } from '../base.dto';
import { ReplyType, StatusType } from '../../constants/dicts.enum';
import { Utils } from '../../utils';
import { UpdateTopicDto } from '../topic/dto/update-topic.dto';
import { ApiException } from '../../common/exception/api-exception';
import { Query } from '@nestjs/common';
import { Res } from '@nestjs/common';
import { LimitCommentDto } from './dto/limit-comment.dto';
import { SearchCommentDto } from './dto/search-comment.dto';

@Controller('comment')
@ApiTags('评论回复')
@ApiBasicAuth('token')
export class CommentController {
  constructor(
    private readonly commentService: CommentService,
    private readonly excelService: ExcelService,
  ) {}

  @Post('add')
  @Auth('system:comment:add')
  @ApiOperation({ summary: '添加' })
  async add(@CurUser() curUser, @Body() createCommentDto: CreateCommentDto) {
    return this.commentService.insert(createCommentDto, curUser);
  }

  @Get('findList')
  @Auth('system:comment:findList')
  @ApiOperation({ summary: '获取列表' })
  async findList(
    @Query() searchCommentDto: SearchCommentDto,
  ): Promise<Comment[]> {
    return await this.commentService.selectList(searchCommentDto);
  }

  @Get('findListPage')
  @Auth('system:comment:findListPage')
  @ApiOperation({ summary: '获取列表（分页）' })
  async findListPage(@Query() limitCommentDto: LimitCommentDto): Promise<any> {
    return await this.commentService.selectListPage(limitCommentDto);
  }

  @Get('findById')
  @Auth('system:comment:findById')
  @ApiOperation({ summary: '获取详情（主键 id）' })
  async findById(@Query() baseFindByIdDto: BaseFindByIdDto): Promise<any> {
    return await this.commentService.selectById(baseFindByIdDto);
  }

  @Get('exportExcel')
  @Auth('account:comment:exportExcel')
  @ApiOperation({ summary: '列表（Excel 导出）' })
  async exportExcel(
    @Query() searchCommentDto: SearchCommentDto,
    @Res() res,
  ): Promise<any> {
    const list = await this.commentService.selectList(searchCommentDto);

    const columns = [
      { key: 'commentId', name: '评论 id', type: 'String', size: 10 },
      { key: 'replyId', name: '回复目标 id', type: 'String', size: 10 },
      {
        key: 'replyType',
        name: '回复类型',
        type: 'Enum',
        size: 10,
        default: ReplyType,
      },
      { key: 'content', name: '回复内容', type: 'String', size: 20 },
      { key: 'fromUid', name: '回复用户 id', type: 'String', size: 10 },
      { key: 'toUid', name: '目标用户 id', type: 'String', size: 10 },
      {
        key: 'status',
        name: '状态',
        type: 'Enum',
        size: 10,
        default: StatusType,
      },
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
        encodeURIComponent(`文章_${Utils.dayjsFormat('YYYYMMDD')}`) +
        '.xlsx', // 中文名需要进行 url 转码
    );
    res.setTimeout(30 * 60 * 1000); // 防止网络原因造成超时。
    res.end(result, 'binary');
  }

  @Post('update')
  @Auth('system:comment:update')
  @ApiOperation({ summary: '修改' })
  async update(
    @CurUser() curUser,
    @Body() updateCommentDto: UpdateCommentDto,
  ): Promise<any> {
    const { id } = updateCommentDto;
    const isExistId = await this.commentService.isExistId(id);
    if (!isExistId) {
      throw new ApiException(`数据 id：${id} 不存在！`, 404);
    }

    return this.commentService.update(updateCommentDto, curUser);
  }

  @Post('delete')
  @Auth('system:comment:delete')
  @ApiOperation({ summary: '删除' })
  async delete(
    @CurUser() curUser,
    @Body() baseFindByIdDto: BaseFindByIdDto,
  ): Promise<any> {
    const { id } = baseFindByIdDto;
    const isExistId = await this.commentService.isExistId(id);

    if (!isExistId) {
      throw new ApiException(`数据 id：${id} 不存在！`, 404);
    }

    return await this.commentService.deleteById(baseFindByIdDto, curUser);
  }

  @Post('deleteBatch')
  @Auth('system:comment:deleteBatch')
  @ApiOperation({ summary: '删除（批量）' })
  async deleteBatch(
    @CurUser() curUser,
    @Body() baseFindByIdsDto: BaseFindByIdsDto,
  ): Promise<any> {
    return await this.commentService.deleteByIds(baseFindByIdsDto, curUser);
  }
}
