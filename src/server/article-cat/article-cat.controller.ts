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
import { BaseFindByIdDto, BaseFindByIdsDto, BaseFindByPIdDto } from '../base.dto';
import { ArticleCat } from './entities/article-cat.entity';
import { LimitArticleCatDto } from './dto/limit-article-cat.dto';
import { SearchArticleCatDto } from './dto/search-article-cat.dto';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';

@Controller('articleCat')
@ApiTags('文章栏目')
@ApiBasicAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class ArticleCatController {
  constructor(private readonly articleCatService: ArticleCatService) {
  }

  @Post('add')
  @Permissions('cms:articleCat:add')
  @ApiOperation({ summary: '添加' })
  async add(@CurUser() curUser, @Body() createArticleCatDto: CreateArticleCatDto) {
    return this.articleCatService.insert(createArticleCatDto, curUser);
  }

  @Get('findList')
  @Permissions('cms:articleCat:findList')
  @ApiOperation({ summary: '获取列表' })
  async findList(@Query() searchArticleCatDto: SearchArticleCatDto): Promise<ArticleCat[]> {
    return await this.articleCatService.selectList(searchArticleCatDto);
  }

  @Get('findListPage')
  @Permissions('cms:articleCat:findListPage')
  @ApiOperation({ summary: '获取列表（分页）' })
  async findListPage(@Query() limitArticleCatDto: LimitArticleCatDto): Promise<any> {
    return await this.articleCatService.selectListPage(limitArticleCatDto);
  }

  @Get('findTree')
  @Permissions('cms:articleCat:findTree')
  @ApiOperation({ summary: '获取树' })
  @ApiQuery({ name: 'parentId', description: '父 id', required: false })
  findTree(@Query() baseFindByPIdDto: BaseFindByPIdDto) {
    return this.articleCatService.selectTree(baseFindByPIdDto);
  }

  @Get('findById')
  @Permissions('cms:articleCat:findById')
  @ApiOperation({ summary: '获取详情（主键 id）' })
  async findById(@Query() baseFindByIdDto: BaseFindByIdDto): Promise<ArticleCat> {
    return await this.articleCatService.selectById(baseFindByIdDto);
  }

  @Post('update')
  @Permissions('cms:articleCat:update')
  @ApiOperation({ summary: '修改' })
  async update(@CurUser() curUser, @Body() updateArticleCatDto: UpdateArticleCatDto): Promise<any> {
    return this.articleCatService.update(updateArticleCatDto, curUser);
  }

  @Post('delete')
  @Permissions('cms:articleCat:delete')
  @ApiOperation({ summary: '删除' })
  async delete(@CurUser() curUser, @Body() baseFindByIdDto: BaseFindByIdDto): Promise<any> {
    let { id } = baseFindByIdDto;
    let isExistId = await this.articleCatService.isExistId(id);

    if (!isExistId) {
      throw new BadRequestException(`数据 id：${id} 不存在！`);
    }

    return await this.articleCatService.deleteById(baseFindByIdDto, curUser);
  }

  @Post('deleteBatch')
  @Permissions('system:articleCat:deleteBatch')
  @ApiOperation({ summary: '删除（批量）' })
  async deleteBatch(@CurUser() curUser, @Body() baseFindByIdsDto: BaseFindByIdsDto): Promise<any> {
    return await this.articleCatService.deleteByIds(baseFindByIdsDto, curUser);
  }
}
