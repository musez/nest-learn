import {
  Controller,
  Get,
  Post,
  Query,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
  BadRequestException,
  Res,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBasicAuth,
  ApiOperation,
} from '@nestjs/swagger';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurUser } from '../../common/decorators/user.decorator';
import { LimitPostDto } from './dto/limit-post.dto';
import { SearchPostDto } from './dto/search-post.dto';
import { BaseFindByIdDto, BaseFindByIdsDto } from '../base.dto';
import { SysPost } from './entities/post.entity';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { Utils } from '../../utils';
import { ExcelService } from '../excel/excel.service';

@Controller('post')
@ApiTags('岗位')
@ApiBasicAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly excelService: ExcelService,
  ) {
  }

  @Post('add')
  @Permissions('account:post:add')
  @ApiOperation({ summary: '添加' })
  async add(@CurUser() curUser, @Body() createPostDto: CreatePostDto) {
    return this.postService.insert(createPostDto, curUser);
  }

  @Get('findList')
  @Permissions('account:post:findList')
  @ApiOperation({ summary: '获取列表' })
  async findList(@Query() searchPostDto: SearchPostDto) {
    return await this.postService.selectList(searchPostDto);
  }

  @Get('findListPage')
  @Permissions('account:post:findListPage')
  @ApiOperation({ summary: '获取列表（分页）' })
  async findListPage(@Query() limitPostDto: LimitPostDto): Promise<any> {
    return await this.postService.selectListPage(limitPostDto);
  }

  @Get('findById')
  @Permissions('account:post:findById')
  @ApiOperation({ summary: '获取详情（主键 id）' })
  async findById(@Query() baseFindByIdDto: BaseFindByIdDto): Promise<SysPost> {
    return await this.postService.selectById(baseFindByIdDto);
  }

  @Get('exportExcel')
  @Permissions('account:post:exportExcel')
  @ApiOperation({ summary: '列表（Excel 导出）' })
  async exportExcel(@Query() searchPostDto: SearchPostDto, @Res() res): Promise<any> {
    const list = await this.postService.selectList(searchPostDto);

    const titleList = [
      { key: 'name', value: '名称' },
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
      'attachment; filename=' + encodeURIComponent(`岗位_${Utils.dayjsFormat('YYYYMMDD')}`) + '.xlsx',// 中文名需要进行 url 转码
    );
    res.setTimeout(30 * 60 * 1000); // 防止网络原因造成超时。
    res.end(result, 'binary');
  }

  @Post('update')
  @Permissions('account:post:update')
  @ApiOperation({ summary: '修改' })
  async update(@CurUser() curUser, @Body() updatePostDto: UpdatePostDto): Promise<any> {
    const { id } = updatePostDto;
    const isExistId = await this.postService.isExistId(id);

    if (!isExistId) {
      throw new BadRequestException(`数据 id：${id} 不存在！`);
    }
    return this.postService.update(updatePostDto, curUser);
  }

  @Post('delete')
  @Permissions('account:post:delete')
  @ApiOperation({ summary: '删除' })
  async delete(@CurUser() curUser, @Body() baseFindByIdDto: BaseFindByIdDto): Promise<any> {
    const { id } = baseFindByIdDto;
    const isExistId = await this.postService.isExistId(id);

    if (!isExistId) {
      throw new BadRequestException(`数据 id：${id} 不存在！`);
    }
    return await this.postService.deleteById(baseFindByIdDto, curUser);
  }

  @Post('deleteBatch')
  @Permissions('system:post:deleteBatch')
  @ApiOperation({ summary: '删除（批量）' })
  async deleteBatch(@CurUser() curUser, @Body() baseFindByIdsDto: BaseFindByIdsDto): Promise<any> {
    return await this.postService.deleteByIds(baseFindByIdsDto, curUser);
  }
}
