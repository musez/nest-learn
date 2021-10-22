import {
  Controller,
  Get,
  Post,
  Query,
  Body,
  UseGuards,
  Res, HttpStatus, Logger,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBasicAuth,
  ApiOperation, ApiResponse,
} from '@nestjs/swagger';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  BaseFindByIdDto,
  BaseFindByIdsDto,
  BaseModifyStatusByIdsDto,
} from '../base.dto';
import { Article } from './entities/article.entity';
import { LimitArticleDto } from './dto/limit-article.dto';
import { CurUser } from '../../common/decorators/cur-user.decorator';
import { SearchArticleDto } from './dto/search-article.dto';
import { Auth } from '../../common/decorators/auth.decorator';
import { AuthGuard } from '../../common/guards/auth.guard';
import { Utils } from '../../utils';
import { ExcelService } from '../excel/excel.service';
import { ArticleDict, ArticleStatusDict, IsCommentDict, StatusDict } from '../../constants/dicts.const';
import { ApiException } from '../../common/exception/api-exception';
import { LimitArticleTopDto } from './dto/limit-article-topic.dto';
import { CreateArticleCommentDto } from './dto/create-article-comment.dto';
import * as trimHtml from 'trim-html';
import { ApiErrorCode } from '../../constants/api-error-code.enum';

@Controller('article')
@ApiTags('文章')
@ApiBasicAuth('token')
@UseGuards(JwtAuthGuard, AuthGuard)
export class ArticleController {
  private readonly logger = new Logger(ArticleController.name);

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

  @Get('findInfoById')
  @Auth('cms:article:findInfoById')
  @ApiOperation({ summary: '获取详情（主键 id，关联信息）' })
  async findInfoById(@Query() baseFindByIdDto: BaseFindByIdDto): Promise<Article> {
    return await this.articleService.selectInfoById(baseFindByIdDto);
  }

  @Get('findDetailById')
  @Auth('cms:article:findDetailById')
  @ApiOperation({ summary: '获取详情（主键 id，热度信息）' })
  async findDetailById(@CurUser() curUser, @Query() baseFindByIdDto: BaseFindByIdDto): Promise<Article> {
    try {
      const ret = await this.articleService.selectById(baseFindByIdDto);
      const incrementRet = await this.articleService.browse(baseFindByIdDto, curUser);

      if (ret && incrementRet) {
        return ret;
      } else {
        throw new ApiException('查询异常！', ApiErrorCode.ERROR, HttpStatus.OK);
      }
    } catch (e) {
      this.logger.error('系统异常：', e);
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  @Get('exportExcel')
  @Auth('account:article:exportExcel')
  @ApiOperation({ summary: '列表（Excel 导出）' })
  async exportExcel(@Query() searchArticleDto: SearchArticleDto, @Res() res): Promise<any> {
    try {
      const list = await this.articleService.selectList(searchArticleDto);

      list.forEach(v => {
        if (v?.content) {
          const content = trimHtml(v.content, { preserveTags: true });
          v.centent = content.html;
        }
      });

      const columns = [
        { key: 'title', name: '标题', type: 'String', size: 10 },
        { key: 'summary', name: '摘要', type: 'String', size: 10 },
        { key: 'author', name: '作者', type: 'String', size: 10 },
        { key: 'source', name: '来源', type: 'String', size: 10 },
        { key: 'keywords', name: '关键字', type: 'String', size: 10 },
        { key: 'type', name: '文章类型', type: 'Enum', size: 10, default: ArticleDict },
        { key: 'contentUrl', name: '链接', type: 'String', size: 10 },
        { key: 'weight', name: '权重', type: 'String', size: 10 },
        { key: 'content', name: '内容', type: 'String', size: 20 },
        { key: 'publishTime', name: '发布时间', type: 'String', size: 10 },
        { key: 'publishBy', name: '发布人', type: 'String', size: 10 },
        { key: 'browseCount', name: '浏览量', type: 'String', size: 10 },
        { key: 'linkCount', name: '点赞量', type: 'String', size: 10 },
        { key: 'collectCount', name: '收藏量', type: 'String', size: 10 },
        { key: 'shareCount', name: '分享量', type: 'String', size: 10 },
        { key: 'commentCount', name: '评论', type: 'String', size: 10 },
        { key: 'isComment', name: '是否可以评论', type: 'Enum', size: 10, default: IsCommentDict },
        { key: 'status', name: '状态', type: 'Enum', size: 10, default: ArticleStatusDict },
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
        encodeURIComponent(`文章_${Utils.dayjsFormat('YYYYMMDD')}`) +
        '.xlsx', // 中文名需要进行 url 转码
      );
      // res.setTimeout(30 * 60 * 1000); // 防止网络原因造成超时。
      res.end(result, 'binary');
    } catch (e) {
      this.logger.error('系统异常：', e);
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  @Post('update')
  @Auth('cms:article:update')
  @ApiOperation({ summary: '修改' })
  async update(@CurUser() curUser, @Body() updateArticleDto: UpdateArticleDto): Promise<any> {
    const { id } = updateArticleDto;
    const isExistId = await this.articleService.isExistId(id);
    if (!isExistId) {
      throw new ApiException(`数据 id：${id} 不存在！`, ApiErrorCode.NOT_FOUND, HttpStatus.OK);
    }

    return this.articleService.update(updateArticleDto, curUser);
  }

  @Post('publish')
  @Auth('cms:article:publish')
  @ApiOperation({ summary: '发布' })
  async publish(@CurUser() curUser, @Body() baseModifyStatusByIdsDto: BaseModifyStatusByIdsDto): Promise<any> {
    baseModifyStatusByIdsDto.status = 1;
    return await this.articleService.updateStatus(
      baseModifyStatusByIdsDto,
      curUser,
    );
  }

  @Post('unPublish')
  @Auth('cms:article:unPublish')
  @ApiOperation({ summary: '取消发布' })
  async unPublish(@CurUser() curUser, @Body() baseModifyStatusByIdsDto: BaseModifyStatusByIdsDto): Promise<any> {
    try {
      baseModifyStatusByIdsDto.status = 0;
      return await this.articleService.updateStatus(
        baseModifyStatusByIdsDto,
        curUser,
      );
    } catch (e) {
      this.logger.error('系统异常：', e);
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  @Post('inRecycle')
  @Auth('cms:article:inRecycle')
  @ApiOperation({ summary: '回收站移入' })
  async inRecycle(@CurUser() curUser, @Body() baseModifyStatusByIdsDto: BaseModifyStatusByIdsDto): Promise<any> {
    try {
      baseModifyStatusByIdsDto.status = 3;
      return await this.articleService.updateStatus(
        baseModifyStatusByIdsDto,
        curUser,
      );
    } catch (e) {
      this.logger.error('系统异常：', e);
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  @Post('outRecycle')
  @Auth('cms:article:outRecycle')
  @ApiOperation({ summary: '回收站移出' })
  async outRecycle(@CurUser() curUser, @Body() baseModifyStatusByIdsDto: BaseModifyStatusByIdsDto): Promise<any> {
    try {
      baseModifyStatusByIdsDto.status = 2;
      return await this.articleService.updateStatus(
        baseModifyStatusByIdsDto,
        curUser,
      );
    } catch (e) {
      this.logger.error('系统异常：', e);
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  @Post('deleteRecycle')
  @Auth('cms:article:deleteRecycle')
  @ApiOperation({ summary: '回收站删除' })
  async delete(@CurUser() curUser, @Body() baseFindByIdDto: BaseFindByIdDto): Promise<any> {
    try {
      const { id } = baseFindByIdDto;
      const isExistId = await this.articleService.isExistId(id);

      if (!isExistId) {
        throw new ApiException(`数据 id：${id} 不存在！`, ApiErrorCode.NOT_FOUND, HttpStatus.OK);
      }

      return await this.articleService.deleteById(baseFindByIdDto, curUser);
    } catch (e) {
      this.logger.error('系统异常：', e);
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  @Post('deleteRecycleBatch')
  @Auth('cms:article:deleteRecycleBatch')
  @ApiOperation({ summary: '回收站删除（批量）' })
  async deleteRecycleBatch(@CurUser() curUser, @Body() baseFindByIdsDto: BaseFindByIdsDto): Promise<any> {
    return await this.articleService.deleteByIds(baseFindByIdsDto, curUser);
  }

  @Post('clearRecycle')
  @Auth('cms:article:clearRecycle')
  @ApiOperation({ summary: '回收站清空' })
  async clearRecycle(@CurUser() curUser): Promise<any> {
    return await this.articleService.deleteAll(curUser);
  }

  @Get('findRank')
  @ApiOperation({ summary: '获取浏览&点赞&收藏&分享&评论排行' })
  async findRank(): Promise<any> {
    const [browseRank, linkRank, collectRank, shareRank, commentRank] = await Promise.all([
      this.articleService.selectBrowseRank(),
      this.articleService.selectLinkRank(),
      this.articleService.selectCollectRank(),
      this.articleService.selectShareRank(),
      this.articleService.selectCommentRank(),
    ]);

    return {
      browse: browseRank,
      link: linkRank,
      collect: collectRank,
      share: shareRank,
      comment: commentRank,
    };
  }

  @Get('findBrowseRank')
  @ApiOperation({ summary: '获取浏览排行' })
  async findBrowseRank(): Promise<any> {
    return await this.articleService.selectBrowseRank();
  }

  // @Post('browse')
  // @ApiOperation({ summary: '浏览' })
  // async browse(@CurUser() curUser, @Body() baseFindByIdDto: BaseFindByIdDto): Promise<any> {
  //   return await this.articleService.browse(baseFindByIdDto, curUser);
  // }

  @Get('findLinkRank')
  @ApiOperation({ summary: '获取点赞排行' })
  async findLinkRank(): Promise<any> {
    return await this.articleService.selectLinkRank();
  }

  @Post('link')
  @ApiOperation({ summary: '点赞/取消点赞' })
  async link(@CurUser() curUser, @Body() baseFindByIdDto: BaseFindByIdDto): Promise<any> {
    return await this.articleService.link(baseFindByIdDto, curUser);
  }

  @Get('findCollectRank')
  @ApiOperation({ summary: '获取收藏排行' })
  async findCollectRank(): Promise<any> {
    return await this.articleService.selectCollectRank();
  }

  @Post('collect')
  @ApiOperation({ summary: '收藏/取消收藏' })
  async collect(@CurUser() curUser, @Body() baseFindByIdDto: BaseFindByIdDto): Promise<any> {
    return await this.articleService.collect(baseFindByIdDto, curUser);
  }

  @Get('findShareRank')
  @ApiOperation({ summary: '获取分享排行' })
  async findShareRank(): Promise<any> {
    return await this.articleService.selectShareRank();
  }

  @Post('share')
  @ApiOperation({ summary: '分享' })
  async share(@CurUser() curUser, @Body() baseFindByIdDto: BaseFindByIdDto): Promise<any> {
    return await this.articleService.share(baseFindByIdDto, curUser);
  }

  @Get('findCommentRank')
  @ApiOperation({ summary: '获取评论排行' })
  async findCommentRank(): Promise<any> {
    return await this.articleService.selectCommentRank();
  }

  // @Post('comment')
  // @ApiOperation({ summary: '评论' })
  // async comment(@CurUser() curUser, @Body() baseFindByIdDto: BaseFindByIdDto): Promise<any> {
  //   return await this.articleService.comment(baseFindByIdDto, curUser);
  // }

  @Post('addComment')
  @Auth('cms:article:addComment')
  @ApiOperation({ summary: '添加评论' })
  @ApiResponse({ status: ApiErrorCode.ARTICLE_DISABLED_COMMENT, description: '文章不允许评论！' })
  async addComment(@CurUser() curUser, @Body() createArticleCommentDto: CreateArticleCommentDto): Promise<any> {
    return await this.articleService.insertComment(
      createArticleCommentDto,
      curUser,
    );
  }

  @Get('findCommentById')
  @Auth('cms:article:findCommentById')
  @ApiOperation({ summary: '获取评论和回复（主键 id）' })
  async findCommentById(@Query() baseFindByIdDto: BaseFindByIdDto): Promise<any> {
    return await this.articleService.selectCommentById(baseFindByIdDto);
  }

  @Get('findCommentPageById')
  @Auth('cms:article:findCommentPageById')
  @ApiOperation({ summary: '获取评论和回复（主键 id，分页）' })
  async findCommentPageById(@Query() limitArticleTopDto: LimitArticleTopDto): Promise<any> {
    return await this.articleService.selectCommentPageById(limitArticleTopDto);
  }
}
