import {
  Controller,
  Get,
  Post,
  Req,
  Query,
  Body,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
  BadRequestException,
  Res,
} from '@nestjs/common';
import {
  ApiTags,
  ApiQuery,
  ApiBody,
  ApiBasicAuth,
  ApiOperation,
} from '@nestjs/swagger';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { BaseFindByIdDto, BaseFindByIdsDto, BaseModifyStatusByIdsDto } from '../base.dto';
import { Article } from './entities/article.entity';
import { LimitArticleDto } from './dto/limit-article.dto';
import { CurUser } from '../../common/decorators/cur-user.decorator';
import { SearchArticleDto } from './dto/search-article.dto';
import { Auth } from '../../common/decorators/auth.decorator';
import { AuthGuard } from '../../common/guards/auth.guard';
import { Utils } from '../../utils';
import { ExcelService } from '../excel/excel.service';
import { ArticleType, IsCommentType, StatusType } from '../../constants/enums';
import { ArticleDict, IsCommentDict, StatusDict } from '../../constants/dicts';

@Controller('article')
@ApiTags('文章')
@ApiBasicAuth('token')
@UseGuards(JwtAuthGuard, AuthGuard)
export class ArticleController {
  constructor(
    private readonly articleService: ArticleService,
    private readonly excelService: ExcelService,
  ) {
  }

  @Post('add')
  @Auth('cms:article:add')
  @ApiOperation({ summary: '添加' })
  async add(@CurUser() curUser, @Body() createArticleDto: CreateArticleDto) {
    return this.articleService.insert(createArticleDto, curUser);
  }

  @Get('findList')
  @Auth('cms:article:findList')
  @ApiOperation({ summary: '获取列表' })
  async findList(@Query() searchArticleDto: SearchArticleDto): Promise<Article[]> {
    return await this.articleService.selectList(searchArticleDto);
  }

  @Get('findListPage')
  @Auth('cms:article:findListPage')
  @ApiOperation({ summary: '获取列表（分页）' })
  async findListPage(@Query() limitArticleDto: LimitArticleDto): Promise<any> {
    return await this.articleService.selectListPage(limitArticleDto);
  }

  @Get('findById')
  @Auth('cms:article:findById')
  @ApiOperation({ summary: '获取详情（主键 id）' })
  async findById(@Query() baseFindByIdDto: BaseFindByIdDto): Promise<Article> {
    return await this.articleService.selectById(baseFindByIdDto);
  }

  @Get('exportExcel')
  @Auth('account:article:exportExcel')
  @ApiOperation({ summary: '列表（Excel 导出）' })
  async exportExcel(@Query() searchArticleDto: SearchArticleDto, @Res() res): Promise<any> {
    const list = await this.articleService.selectList(searchArticleDto);

    const columns = [
      { key: 'title', name: '标题', type: 'String', size: 10 },
      { key: 'summary', name: '摘要', type: 'String', size: 10 },
      { key: 'author', name: '作者', type: 'String', size: 10 },
      { key: 'source', name: '来源', type: 'String', size: 10 },
      { key: 'keywords', name: '关键字', type: 'String', size: 10 },
      { key: 'type', name: '文章类型', type: 'Enum', size: 10, default: ArticleDict },
      { key: 'contentUrl', name: '链接', type: 'String', size: 10 },
      { key: 'weight', name: '权重', type: 'String', size: 10 },
      { key: 'publicTime', name: '发布时间', type: 'String', size: 10 },
      { key: 'publicBy', name: '发布人', type: 'String', size: 10 },
      { key: 'browseCount', name: '浏览量', type: 'String', size: 10 },
      { key: 'linkCount', name: '点赞量', type: 'String', size: 10 },
      { key: 'collectCount', name: '收藏量', type: 'String', size: 10 },
      { key: 'shareCount', name: '分享量', type: 'String', size: 10 },
      { key: 'commentCount', name: '评论', type: 'String', size: 10 },
      { key: 'isComment', name: '是否可以评论', type: 'Enum', size: 10, default: IsCommentDict },
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
      'attachment; filename=' + encodeURIComponent(`文章_${Utils.dayjsFormat('YYYYMMDD')}`) + '.xlsx',// 中文名需要进行 url 转码
    );
    res.setTimeout(30 * 60 * 1000); // 防止网络原因造成超时。
    res.end(result, 'binary');
  }

  @Post('update')
  @Auth('cms:article:update')
  @ApiOperation({ summary: '修改' })
  async update(@CurUser() curUser, @Body() updateArticleDto: UpdateArticleDto): Promise<any> {
    const { id } = updateArticleDto;
    const isExistId = await this.articleService.isExistId(id);
    if (!isExistId) {
      throw new BadRequestException(`数据 id：${id} 不存在！`);
    }

    return this.articleService.update(updateArticleDto, curUser);
  }

  @Post('inRecycle')
  @Auth('cms:article:inRecycle')
  @ApiOperation({ summary: '回收站移入' })
  async inRecycle(@CurUser() curUser, @Body() baseModifyStatusByIdsDto: BaseModifyStatusByIdsDto): Promise<any> {
    baseModifyStatusByIdsDto.status = 3;
    return await this.articleService.updateRecycle(baseModifyStatusByIdsDto, curUser);
  }

  @Post('outRecycle')
  @Auth('cms:article:outRecycle')
  @ApiOperation({ summary: '回收站移出' })
  async outRecycle(@CurUser() curUser, @Body() baseModifyStatusByIdsDto: BaseModifyStatusByIdsDto): Promise<any> {
    baseModifyStatusByIdsDto.status = 2;
    return await this.articleService.updateRecycle(baseModifyStatusByIdsDto, curUser);
  }

  @Post('deleteRecycle')
  @Auth('cms:article:deleteRecycle')
  @ApiOperation({ summary: '回收站删除' })
  async delete(@CurUser() curUser, @Body() baseFindByIdDto: BaseFindByIdDto): Promise<any> {
    const { id } = baseFindByIdDto;
    const isExistId = await this.articleService.isExistId(id);

    if (!isExistId) {
      throw new BadRequestException(`数据 id：${id} 不存在！`);
    }

    return await this.articleService.deleteById(baseFindByIdDto, curUser);
  }

  @Post('clearRecycle')
  @Auth('cms:article:clearRecycle')
  @ApiOperation({ summary: '回收站清空/删除（批量）' })
  async clearRecycle(@CurUser() curUser, @Body() baseFindByIdsDto: BaseFindByIdsDto): Promise<any> {
    return await this.articleService.clearRecycle(baseFindByIdsDto, curUser);
  }
}
