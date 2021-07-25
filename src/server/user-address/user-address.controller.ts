import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { UserAddressService } from './user-address.service';
import { CreateUserAddressDto } from './dto/create-user-address.dto';
import { UpdateUserAddressDto } from './dto/update-user-address.dto';
import { ApiBasicAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ExcelService } from '../excel/excel.service';
import { Auth } from '../../common/decorators/auth.decorator';
import { CurUser } from '../../common/decorators/cur-user.decorator';
import { LimitArticleDto } from '../article/dto/limit-article.dto';
import { BaseFindByIdDto, BaseFindByIdsDto, BaseModifyStatusByIdsDto } from '../base.dto';
import { Utils } from '../../utils';
import { BadRequestException } from '@nestjs/common';
import { Query } from '@nestjs/common';
import { UserAddress } from './entities/user-address.entity';
import { Res } from '@nestjs/common';
import { SearchUserAddressDto } from './dto/search-user-address.dto';

@ApiTags('用户地址')
@ApiBasicAuth('token')
@Controller('user-address')
export class UserAddressController {
  constructor(
    private readonly userAddressService: UserAddressService,
    private readonly excelService: ExcelService,
  ) {
  }

  @Post('add')
  @Auth('cms:article:findList')
  @ApiOperation({ summary: '添加' })
  async add(@CurUser() curUser, @Body() createDto: CreateUserAddressDto) {
    return this.userAddressService.insert(createDto, curUser);
  }

  @Get('findList')
  @Auth('cms:article:findList')
  @ApiOperation({ summary: '获取列表' })
  async findList(@Query() searchDto: SearchUserAddressDto): Promise<UserAddress[]> {
    return await this.userAddressService.selectList(searchDto);
  }

  @Get('findListPage')
  @Auth('cms:article:findListPage')
  @ApiOperation({ summary: '获取列表（分页）' })
  async findListPage(@Query() limitDto: LimitArticleDto): Promise<any> {
    return await this.userAddressService.selectListPage(limitDto);
  }

  @Get('findById')
  @Auth('cms:article:findById')
  @ApiOperation({ summary: '获取详情（主键 id）' })
  async findById(@Query() baseFindByIdDto: BaseFindByIdDto): Promise<UserAddress> {
    return await this.userAddressService.selectById(baseFindByIdDto);
  }

  @Get('exportExcel')
  @Auth('account:article:exportExcel')
  @ApiOperation({ summary: '列表（Excel 导出）' })
  async exportExcel(@Query() searchDto: SearchUserAddressDto, @Res() res): Promise<any> {
    const list = await this.userAddressService.selectList(searchDto);

    const titleList = [
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
  @Auth('cms:article:update')
  @ApiOperation({ summary: '修改' })
  async update(@CurUser() curUser, @Body() updateDto: UpdateUserAddressDto): Promise<any> {
    const { id } = updateDto;
    const isExistId = await this.userAddressService.isExistId(id);
    if (!isExistId) {
      throw new BadRequestException(`数据 id：${id} 不存在！`);
    }

    return this.userAddressService.update(updateDto, curUser);
  }

  @Post('delete')
  @Auth('cms:article:delete')
  @ApiOperation({ summary: '删除' })
  async delete(@CurUser() curUser, @Body() baseFindByIdDto: BaseFindByIdDto): Promise<any> {
    const { id } = baseFindByIdDto;
    const isExistId = await this.userAddressService.isExistId(id);

    if (!isExistId) {
      throw new BadRequestException(`数据 id：${id} 不存在！`);
    }

    return await this.userAddressService.deleteById(baseFindByIdDto, curUser);
  }
}
