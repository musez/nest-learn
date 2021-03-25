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
import { BaseFindByIdDto, BaseFindByIdsDto, BaseModifyStatusByIdsDto } from '../base.dto';
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

  @Post('update')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '修改' })
  async update(@CurUser() curUser, @Body() updateArticleDto: UpdateArticleDto): Promise<any> {
    let { id } = updateArticleDto;
    let isExistId = await this.articleService.isExistId(id);
    if (!isExistId) {
      throw new BadRequestException(`数据 id：${id} 不存在！`);
    }

    return this.articleService.update(updateArticleDto, curUser);
  }

  @Post('delete')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '删除' })
  async delete(@CurUser() curUser, @Body() baseFindByIdDto: BaseFindByIdDto): Promise<any> {
    let { id } = baseFindByIdDto;
    let isExistId = await this.articleService.isExistId(id);

    if (!isExistId) {
      throw new BadRequestException(`数据 id：${id} 不存在！`);
    }

    return await this.articleService.deleteById(baseFindByIdDto);
  }

  @Post('inRecycle')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '移入回收站' })
  async inRecycle(@CurUser() curUser, @Body() baseModifyStatusByIdsDto: BaseModifyStatusByIdsDto): Promise<any> {
    baseModifyStatusByIdsDto.status = 3;
    return await this.articleService.updateRecycle(baseModifyStatusByIdsDto, curUser);
  }

  @Post('outRecycle')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '移出回收站' })
  async outRecycle(@CurUser() curUser, @Body() baseModifyStatusByIdsDto: BaseModifyStatusByIdsDto): Promise<any> {
    baseModifyStatusByIdsDto.status = 2;
    return await this.articleService.updateRecycle(baseModifyStatusByIdsDto, curUser);
  }

  @Post('clearRecycle')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '清空回收站' })
  async clearRecycle(@CurUser() curUser, @Body() baseFindByIdsDto: BaseFindByIdsDto): Promise<any> {
    return await this.articleService.clearRecycle(baseFindByIdsDto);
  }
}
