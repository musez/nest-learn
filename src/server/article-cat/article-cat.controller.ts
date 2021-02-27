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
} from '@nestjs/common';
import {
  ApiTags,
  ApiQuery,
  ApiBody,
  ApiBasicAuth,
  ApiOperation,
} from '@nestjs/swagger';
import { ArticleCatService } from './article-cat.service';
import { CreateArticleCatDto } from './dto/create-article-cat.dto';
import { UpdateArticleCatDto } from './dto/update-article-cat.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurUser } from '../../common/decorators/user.decorator';
import { Article } from '../article/entities/article.entity';
import { LimitArticleDto } from '../article/dto/limit-article.dto';
import { BaseFindByIdDto, BaseFindByPIdDto } from '../base.dto';
import { ArticleCat } from './entities/article-cat.entity';
import { LimitArticleCatDto } from './dto/limit-article-cat.dto';
import { BaseArticleCatDto } from './dto/base-article-cat.dto';
import { SearchArticleCatDto } from './dto/search-article-cat.dto';

@Controller('articleCat')
@ApiTags('文章栏目')
@ApiBasicAuth()
export class ArticleCatController {
  constructor(private readonly articleCatService: ArticleCatService) {
  }

  @Post('add')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '添加' })
  async add(@CurUser() curUser, @Body() createArticleCatDto: CreateArticleCatDto) {
    return this.articleCatService.insert(createArticleCatDto, curUser);
  }

  @Get('findList')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '获取列表' })
  async findList(@Query() searchArticleCatDto: SearchArticleCatDto): Promise<ArticleCat[]> {
    return await this.articleCatService.selectList(searchArticleCatDto);
  }

  @Get('findListPage')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '获取列表（分页）' })
  async findListPage(@Query() limitArticleCatDto: LimitArticleCatDto): Promise<any> {
    return await this.articleCatService.selectListPage(limitArticleCatDto);
  }

  @Get('findTree')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '获取树' })
  @ApiQuery({ name: 'parentId', description: '父 id', required: false })
  findTree(@Query() baseFindByPIdDto: BaseFindByPIdDto) {
    return this.articleCatService.selectTree(baseFindByPIdDto);
  }

  @Get('findById')
  @ApiOperation({ summary: '获取详情（主键 id）' })
  @UseGuards(JwtAuthGuard)
  async findById(@Query() baseFindByIdDto: BaseFindByIdDto): Promise<ArticleCat> {
    return await this.articleCatService.selectById(baseFindByIdDto);
  }

  @Post('modify')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '修改' })
  async modify(@CurUser() curUser, @Body() updateArticleCatDto: UpdateArticleCatDto): Promise<any> {
    return this.articleCatService.update(updateArticleCatDto, curUser);
  }

  @Post('remove')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '删除' })
  async remove(@CurUser() curUser, @Body() baseFindByIdDto: BaseFindByIdDto): Promise<any> {
    return await this.articleCatService.deleteById(baseFindByIdDto);
  }
}
