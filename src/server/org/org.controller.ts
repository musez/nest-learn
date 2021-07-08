import {
  Controller,
  Get,
  Post,
  Req,
  Request,
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
  ApiBasicAuth,
  ApiOperation,
} from '@nestjs/swagger';
import { OrgService } from './org.service';
import { CreateOrgDto } from './dto/create-org.dto';
import { UpdateOrgDto } from './dto/update-org.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurUser } from '../../common/decorators/cur-user.decorator';
import { SearchOrgDto } from './dto/search-org.dto';
import { Org } from './entities/org.entity';
import { LimitOrgDto } from './dto/limit-org.dto';
import { BaseFindByIdDto, BaseFindByIdsDto, BaseFindByPIdDto } from '../base.dto';
import { AuthGuard } from '../../common/guards/auth.guard';
import { Auth } from '../../common/decorators/auth.decorator';
import { Utils } from '../../utils';
import { ExcelService } from '../excel/excel.service';

@Controller('org')
@ApiTags('组织机构')
@ApiBasicAuth('jwt')
@UseGuards(JwtAuthGuard, AuthGuard)
export class OrgController {
  constructor(
    private readonly orgService: OrgService,
    private readonly excelService: ExcelService,
  ) {
  }

  @Post('add')
  @Auth('account:org:add')
  @ApiOperation({ summary: '添加' })
  async add(@CurUser() curUser, @Body() createOrgDto: CreateOrgDto) {
    return this.orgService.insert(createOrgDto, curUser);
  }

  @Get('findList')
  @Auth('account:org:findList')
  @ApiOperation({ summary: '获取列表' })
  async findList(@Query() searchOrgDto: SearchOrgDto): Promise<Org[]> {
    return await this.orgService.selectList(searchOrgDto);
  }

  @Get('findListPage')
  @Auth('account:org:findListPage')
  @ApiOperation({ summary: '获取列表（分页）' })
  async findListPage(@Query() limitOrgDto: LimitOrgDto): Promise<any> {
    return await this.orgService.selectListPage(limitOrgDto);
  }

  @Get('findTree')
  @Auth('account:org:findTree')
  @ApiOperation({ summary: '获取树' })
  async findTree(@Query() baseFindByPIdDto: BaseFindByPIdDto): Promise<any> {
    return this.orgService.selectTree(baseFindByPIdDto);
  }

  @Get('findById')
  @Auth('account:org:findById')
  @ApiOperation({ summary: '获取详情（主键 id）' })
  async findById(@Query() baseFindByIdDto: BaseFindByIdDto): Promise<Org> {
    return await this.orgService.selectById(baseFindByIdDto);
  }

  @Get('exportExcel')
  @Auth('account:org:exportExcel')
  @ApiOperation({ summary: '列表（Excel 导出）' })
  async exportExcel(@Query() searchOrgDto: SearchOrgDto, @Res() res): Promise<any> {
    const list = await this.orgService.selectList(searchOrgDto);

    const titleList = [
      { key: 'name', value: '名称' },
      { key: 'shortName', value: '简称' },
      { key: 'orgType', value: '机构类型' },
      { key: 'orgType', value: '机构类型' },
      { key: 'orgLevel', value: '机构级次码' },
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
      'attachment; filename=' + encodeURIComponent(`组织机构_${Utils.dayjsFormat('YYYYMMDD')}`) + '.xlsx',// 中文名需要进行 url 转码
    );
    res.setTimeout(30 * 60 * 1000); // 防止网络原因造成超时。
    res.end(result, 'binary');
  }

  @Post('update')
  @Auth('account:org:update')
  @ApiOperation({ summary: '修改' })
  async update(@CurUser() curUser, @Body() updateOrgDto: UpdateOrgDto): Promise<any> {
    let { id } = updateOrgDto;
    let isExistId = await this.orgService.isExistId(id);

    if (!isExistId) {
      throw new BadRequestException(`数据 id：${id} 不存在！`);
    }
    return this.orgService.update(updateOrgDto, curUser);
  }

  @Post('delete')
  @Auth('account:org:delete')
  @ApiOperation({ summary: '删除' })
  async delete(@CurUser() curUser, @Body() baseFindByIdDto: BaseFindByIdDto): Promise<any> {
    let { id } = baseFindByIdDto;
    let isExistId = await this.orgService.isExistId(id);

    if (!isExistId) {
      throw new BadRequestException(`数据 id：${id} 不存在！`);
    }

    return await this.orgService.deleteById(baseFindByIdDto, curUser);
  }

  @Post('deleteBatch')
  @Auth('system:org:deleteBatch')
  @ApiOperation({ summary: '删除（批量）' })
  async deleteBatch(@CurUser() curUser, @Body() baseFindByIdsDto: BaseFindByIdsDto): Promise<any> {
    return await this.orgService.deleteByIds(baseFindByIdsDto, curUser);
  }
}
