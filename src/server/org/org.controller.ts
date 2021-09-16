import { Controller, Get, Post, Query, Body, UseGuards, Res, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiBasicAuth, ApiOperation } from '@nestjs/swagger';
import { OrgService } from './org.service';
import { CreateOrgDto } from './dto/create-org.dto';
import { UpdateOrgDto } from './dto/update-org.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurUser } from '../../common/decorators/cur-user.decorator';
import { SearchOrgDto } from './dto/search-org.dto';
import { Org } from './entities/org.entity';
import { LimitOrgDto } from './dto/limit-org.dto';
import { BaseFindByIdDto, BaseFindByIdsDto, BaseFindByPIdDto, BaseModifyStatusByIdsDto } from '../base.dto';
import { AuthGuard } from '../../common/guards/auth.guard';
import { Auth } from '../../common/decorators/auth.decorator';
import { Utils } from '../../utils';
import { ExcelService } from '../excel/excel.service';
import { OrgDict, StatusDict } from '../../constants/dicts.const';
import { ApiException } from '../../common/exception/api-exception';
import { ApiErrorCode } from '../../constants/api-error-code.enum';

@Controller('org')
@ApiTags('组织机构')
@ApiBasicAuth('token')
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
    try {
      const list = await this.orgService.selectAll(searchOrgDto);

      const columns = [
        { key: 'name', name: '名称', type: 'String', size: 10 },
        { key: 'shortName', name: '简称', type: 'String', size: 10 },
        {
          key: 'orgType',
          name: '机构类型',
          type: 'Enum',
          size: 10,
          default: OrgDict,
        },
        { key: 'orgLevel', name: '机构级次码', type: 'String', size: 10 },
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
        encodeURIComponent(`组织机构_${Utils.dayjsFormat('YYYYMMDD')}`) +
        '.xlsx', // 中文名需要进行 url 转码
      );
      // res.setTimeout(30 * 60 * 1000); // 防止网络原因造成超时。
      res.end(result, 'binary');
    } catch (e) {
       throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  @Post('update')
  @Auth('account:org:update')
  @ApiOperation({ summary: '修改' })
  async update(@CurUser() curUser, @Body() updateOrgDto: UpdateOrgDto): Promise<any> {
    try {
      const { id } = updateOrgDto;
      const isExistId = await this.orgService.isExistId(id);

      if (!isExistId) {
        throw new ApiException(`数据 id：${id} 不存在！`, ApiErrorCode.NOT_FOUND, HttpStatus.OK);
      }
      return this.orgService.update(updateOrgDto, curUser);
    } catch (e) {
       throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  @Post('updateStatus')
  @Auth('account:org:updateStatus')
  @ApiOperation({ summary: '修改状态' })
  async updateStatus(@CurUser() curUser, @Body() baseModifyStatusByIdsDto: BaseModifyStatusByIdsDto): Promise<any> {
    return this.orgService.updateStatus(baseModifyStatusByIdsDto, curUser);
  }

  @Post('delete')
  @Auth('account:org:delete')
  @ApiOperation({ summary: '删除' })
  async delete(@CurUser() curUser, @Body() baseFindByIdDto: BaseFindByIdDto): Promise<any> {
    try {
      const { id } = baseFindByIdDto;
      const isExistId = await this.orgService.isExistId(id);

      if (!isExistId) {
        throw new ApiException(`数据 id：${id} 不存在！`, ApiErrorCode.NOT_FOUND, HttpStatus.OK);
      }

      return await this.orgService.deleteById(baseFindByIdDto, curUser);
    } catch (e) {
       throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  @Post('deleteBatch')
  @Auth('account:org:deleteBatch')
  @ApiOperation({ summary: '删除（批量）' })
  async deleteBatch(@CurUser() curUser, @Body() baseFindByIdsDto: BaseFindByIdsDto): Promise<any> {
    return await this.orgService.deleteByIds(baseFindByIdsDto, curUser);
  }
}
