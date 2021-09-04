import {
  Controller,
  Get,
  Post,
  Query,
  Body,
  UseGuards,
  Res,
} from '@nestjs/common';
import {
  ApiTags,
  ApiQuery,
  ApiBasicAuth,
  ApiOperation,
} from '@nestjs/swagger';
import { ArticleCatService } from './article-cat.service';
import { CreateArticleCatDto } from './dto/create-article-cat.dto';
import { UpdateArticleCatDto } from './dto/update-article-cat.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurUser } from '../../common/decorators/cur-user.decorator';
import {
  BaseFindByIdDto,
  BaseFindByIdsDto,
  BaseFindByPIdDto,
  BaseModifyStatusByIdsDto,
} from '../base.dto';
import { ArticleCat } from './entities/article-cat.entity';
import { LimitArticleCatDto } from './dto/limit-article-cat.dto';
import { SearchArticleCatDto } from './dto/search-article-cat.dto';
import { AuthGuard } from '../../common/guards/auth.guard';
import { Auth } from '../../common/decorators/auth.decorator';
import { Utils } from '../../utils';
import { ExcelService } from '../excel/excel.service';
import { StatusDict } from '../../constants/dicts.const';
import { ApiException } from '../../common/exception/api-exception';

@Controller('articleCat')
@ApiTags('文章栏目')
@ApiBasicAuth('token')
@UseGuards(JwtAuthGuard, AuthGuard)
export class ArticleCatController {
  constructor(
    private readonly articleCatService: ArticleCatService,
    private readonly excelService: ExcelService,
  ) {
  }

  @Post('add')
  @Auth('cms:articleCat:add')
  @ApiOperation({ summary: '添加' })
  async add(@CurUser() curUser, @Body() createArticleCatDto: CreateArticleCatDto) {
    return this.articleCatService.insert(createArticleCatDto, curUser);
  }

  @Get('findList')
  @Auth('cms:articleCat:findList')
  @ApiOperation({ summary: '获取列表' })
  async findList(@Query() searchArticleCatDto: SearchArticleCatDto): Promise<ArticleCat[]> {
    return await this.articleCatService.selectList(searchArticleCatDto);
  }

  @Get('findListPage')
  @Auth('cms:articleCat:findListPage')
  @ApiOperation({ summary: '获取列表（分页）' })
  async findListPage(
    @Query() limitArticleCatDto: LimitArticleCatDto,
  ): Promise<any> {
    return await this.articleCatService.selectListPage(limitArticleCatDto);
  }

  @Get('findTree')
  @Auth('cms:articleCat:findTree')
  @ApiOperation({ summary: '获取树' })
  @ApiQuery({ name: 'parentId', description: '父 id', required: false })
  findTree(@Query() baseFindByPIdDto: BaseFindByPIdDto) {
    return this.articleCatService.selectTree(baseFindByPIdDto);
  }

  @Get('findById')
  @Auth('cms:articleCat:findById')
  @ApiOperation({ summary: '获取详情（主键 id）' })
  async findById(@Query() baseFindByIdDto: BaseFindByIdDto): Promise<ArticleCat> {
    return await this.articleCatService.selectById(baseFindByIdDto);
  }

  @Get('exportExcel')
  @Auth('account:articleCat:exportExcel')
  @ApiOperation({ summary: '列表（Excel 导出）' })
  async exportExcel(@Query() searchArticleCatDto: SearchArticleCatDto, @Res() res): Promise<any> {
    const list = await this.articleCatService.selectAll(searchArticleCatDto);

    const columns = [
      { key: 'catName', name: '栏目名称', type: 'String', size: 10 },
      {
        key: 'status',
        name: '状态',
        type: 'Enum',
        size: 10,
        default: StatusDict,
      },
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
      encodeURIComponent(`文章分类_${Utils.dayjsFormat('YYYYMMDD')}`) +
      '.xlsx', // 中文名需要进行 url 转码
    );
    // res.setTimeout(30 * 60 * 1000); // 防止网络原因造成超时。
    res.end(result, 'binary');
  }

  @Post('update')
  @Auth('cms:articleCat:update')
  @ApiOperation({ summary: '修改' })
  async update(@CurUser() curUser, @Body() updateArticleCatDto: UpdateArticleCatDto): Promise<any> {
    return this.articleCatService.update(updateArticleCatDto, curUser);
  }

  @Post('updateStatus')
  @Auth('cms:articleCat:updateStatus')
  @ApiOperation({ summary: '修改状态' })
  async updateStatus(@CurUser() curUser, @Body() baseModifyStatusByIdsDto: BaseModifyStatusByIdsDto): Promise<any> {
    return this.articleCatService.updateStatus(baseModifyStatusByIdsDto, curUser);
  }

  @Post('delete')
  @Auth('cms:articleCat:delete')
  @ApiOperation({ summary: '删除' })
  async delete(@CurUser() curUser, @Body() baseFindByIdDto: BaseFindByIdDto): Promise<any> {
    const { id } = baseFindByIdDto;
    const isExistId = await this.articleCatService.isExistId(id);

    if (!isExistId) {
      throw new ApiException(`数据 id：${id} 不存在！`, 404);
    }

    return await this.articleCatService.deleteById(baseFindByIdDto, curUser);
  }

  @Post('deleteBatch')
  @Auth('system:articleCat:deleteBatch')
  @ApiOperation({ summary: '删除（批量）' })
  async deleteBatch(@CurUser() curUser, @Body() baseFindByIdsDto: BaseFindByIdsDto): Promise<any> {
    return await this.articleCatService.deleteByIds(baseFindByIdsDto, curUser);
  }
}
