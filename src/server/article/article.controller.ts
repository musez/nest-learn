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
import { CurUser } from '../../common/decorators/user.decorator';
import { SearchArticleDto } from './dto/search-article.dto';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Utils } from '../../utils';
import { ExcelService } from '../excel/excel.service';

@Controller('article')
@ApiTags('文章')
@ApiBasicAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class ArticleController {
  constructor(
    private readonly articleService: ArticleService,
    private readonly excelService: ExcelService,
  ) {
  }

  @Post('add')
  @Permissions('cms:article:findList')
  @ApiOperation({ summary: '添加' })
  async add(@CurUser() curUser, @Body() createArticleDto: CreateArticleDto) {
    return this.articleService.insert(createArticleDto, curUser);
  }

  @Get('findList')
  @Permissions('cms:article:findList')
  @ApiOperation({ summary: '获取列表' })
  async findList(@Query() searchArticleDto: SearchArticleDto): Promise<Article[]> {
    return await this.articleService.selectList(searchArticleDto);
  }

  @Get('findListPage')
  @Permissions('cms:article:findListPage')
  @ApiOperation({ summary: '获取列表（分页）' })
  async findListPage(@Query() limitArticleDto: LimitArticleDto): Promise<any> {
    return await this.articleService.selectListPage(limitArticleDto);
  }

  @Get('findById')
  @Permissions('cms:article:findById')
  @ApiOperation({ summary: '获取详情（主键 id）' })
  async findById(@Query() baseFindByIdDto: BaseFindByIdDto): Promise<Article> {
    return await this.articleService.selectById(baseFindByIdDto);
  }

  @Get('exportExcel')
  @Permissions('account:article:exportExcel')
  @ApiOperation({ summary: '列表（Excel 导出）' })
  async exportExcel(@Query() searchArticleDto: SearchArticleDto, @Res() res): Promise<any> {
    const list = await this.articleService.selectList(searchArticleDto);

    const titleList = [
      { key: 'title', value: '标题' },
      { key: 'summary', value: '摘要' },
      { key: 'author', value: '作者' },
      { key: 'source', value: '来源' },
      { key: 'keywords', value: '关键字' },
      { key: 'type', value: '文章类型' },
      { key: 'contentUrl', value: '链接' },
      { key: 'weight', value: '权重' },
      { key: 'publicTime', value: '发布时间' },
      { key: 'publicBy', value: '发布人' },
      { key: 'browseCount', value: '浏览量' },
      { key: 'linkCount', value: '点赞量' },
      { key: 'collectCount', value: '收藏量' },
      { key: 'shareCount', value: '分享量' },
      { key: 'commentCount', value: '评论' },
      { key: 'isComment', value: '是否可以评论' },
      { key: 'status', value: '状态' },
      { key: 'description', value: '备注' },
      { key: 'createTime', value: '创建时间' },
      { key: 'updateTime', value: '修改时间' },
    ];
    const result = this.excelService.exportExcel(titleList, list);

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
  @Permissions('cms:article:update')
  @ApiOperation({ summary: '修改' })
  async update(@CurUser() curUser, @Body() updateArticleDto: UpdateArticleDto): Promise<any> {
    const { id } = updateArticleDto;
    const isExistId = await this.articleService.isExistId(id);
    if (!isExistId) {
      throw new BadRequestException(`数据 id：${id} 不存在！`);
    }

    return this.articleService.update(updateArticleDto, curUser);
  }

  @Post('delete')
  @Permissions('cms:article:delete')
  @ApiOperation({ summary: '删除' })
  async delete(@CurUser() curUser, @Body() baseFindByIdDto: BaseFindByIdDto): Promise<any> {
    const { id } = baseFindByIdDto;
    const isExistId = await this.articleService.isExistId(id);

    if (!isExistId) {
      throw new BadRequestException(`数据 id：${id} 不存在！`);
    }

    return await this.articleService.deleteById(baseFindByIdDto, curUser);
  }

  @Post('inRecycle')
  @Permissions('cms:article:inRecycle')
  @ApiOperation({ summary: '移入回收站' })
  async inRecycle(@CurUser() curUser, @Body() baseModifyStatusByIdsDto: BaseModifyStatusByIdsDto): Promise<any> {
    baseModifyStatusByIdsDto.status = 3;
    return await this.articleService.updateRecycle(baseModifyStatusByIdsDto, curUser);
  }

  @Post('outRecycle')
  @Permissions('cms:article:outRecycle')
  @ApiOperation({ summary: '移出回收站' })
  async outRecycle(@CurUser() curUser, @Body() baseModifyStatusByIdsDto: BaseModifyStatusByIdsDto): Promise<any> {
    baseModifyStatusByIdsDto.status = 2;
    return await this.articleService.updateRecycle(baseModifyStatusByIdsDto, curUser);
  }

  @Post('clearRecycle')
  @Permissions('cms:article:clearRecycle')
  @ApiOperation({ summary: '清空回收站/删除（批量）' })
  async clearRecycle(@CurUser() curUser, @Body() baseFindByIdsDto: BaseFindByIdsDto): Promise<any> {
    return await this.articleService.clearRecycle(baseFindByIdsDto, curUser);
  }
}
