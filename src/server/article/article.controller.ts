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
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { BaseFindByIdDto } from '../base.dto';
import { Article } from './entities/article.entity';
import { LimitArticleDto } from './dto/limit-article.dto';
import { CurUser } from '../../common/decorators/user.decorator';
import { SearchArticleDto } from './dto/search-article.dto';

@Controller('article')
@ApiTags('文章')
@ApiBasicAuth()
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {
  }

  @Post('add')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '添加' })
  async add(@CurUser() curUser, @Body() createArticleDto: CreateArticleDto) {
    return this.articleService.insert(createArticleDto, curUser);
  }

  @Get('findList')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '获取列表' })
  async findList(@Query() searchArticleDto: SearchArticleDto): Promise<Article[]> {
    return await this.articleService.selectList(searchArticleDto);
  }

  @Get('findListPage')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '获取列表（分页）' })
  async findListPage(@Query() limitArticleDto: LimitArticleDto): Promise<any> {
    return await this.articleService.selectListPage(limitArticleDto);
  }

  @Get('findById')
  @ApiOperation({ summary: '获取详情（主键 id）' })
  @UseGuards(JwtAuthGuard)
  async findById(@Query() baseFindByIdDto: BaseFindByIdDto): Promise<Article> {
    return await this.articleService.selectById(baseFindByIdDto);
  }

  @Post('modify')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '修改' })
  async modify(@CurUser() curUser, @Body() updateArticleDto: UpdateArticleDto): Promise<any> {
    return this.articleService.update(updateArticleDto, curUser);
  }

  @Post('remove')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '删除' })
  async remove(@CurUser() curUser, @Body() baseFindByIdDto: BaseFindByIdDto): Promise<any> {
    return await this.articleService.deleteById(baseFindByIdDto);
  }
}
