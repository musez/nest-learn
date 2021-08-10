import { Controller, Get, Post, Body, Put, Param, Delete, Query, Res, BadRequestException } from '@nestjs/common';
import { ApiBasicAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserAddressService } from './user-address.service';
import { CreateUserAddressDto } from './dto/create-user-address.dto';
import { UpdateUserAddressDto } from './dto/update-user-address.dto';
import { ExcelService } from '../excel/excel.service';
import { Auth } from '../../common/decorators/auth.decorator';
import { CurUser } from '../../common/decorators/cur-user.decorator';
import { BaseFindByIdDto, BaseFindByIdsDto, BaseModifyStatusByIdsDto } from '../base.dto';
import { Utils } from '../../utils';
import { UserAddress } from './entities/user-address.entity';
import { SearchUserAddressDto } from './dto/search-user-address.dto';
import { LimitUserAddressDto } from './dto/limit-user-address.dto';
import { StatusType } from '../../constants/dicts.enum';
import { StatusDict } from '../../constants/dicts';

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
  @Auth('mall:userAddress:add')
  @ApiOperation({ summary: '添加' })
  async add(@CurUser() curUser, @Body() createDto: CreateUserAddressDto) {
    const { userId } = createDto;
    if (!userId) {
      throw new BadRequestException(`数据 userId：${userId} 不存在！`);
    }
    return this.userAddressService.insert(createDto, curUser);
  }

  @Get('findList')
  @Auth('mall:userAddress:findList')
  @ApiOperation({ summary: '获取列表' })
  async findList(@Query() searchDto: SearchUserAddressDto): Promise<UserAddress[]> {
    return await this.userAddressService.selectList(searchDto);
  }

  @Get('findListPage')
  @Auth('mall:userAddress:findListPage')
  @ApiOperation({ summary: '获取列表（分页）' })
  async findListPage(@Query() limitDto: LimitUserAddressDto): Promise<any> {
    return await this.userAddressService.selectListPage(limitDto);
  }

  @Get('findById')
  @Auth('mall:userAddress:findById')
  @ApiOperation({ summary: '获取详情（主键 id）' })
  async findById(@Query() baseFindByIdDto: BaseFindByIdDto): Promise<UserAddress> {
    return await this.userAddressService.selectById(baseFindByIdDto);
  }

  @Get('exportExcel')
  @Auth('mall:userAddress:exportExcel')
  @ApiOperation({ summary: '列表（Excel 导出）' })
  async exportExcel(@Query() searchDto: SearchUserAddressDto, @Res() res): Promise<any> {
    const list = await this.userAddressService.selectList(searchDto);
    const columns = [
      { key: 'name', name: '姓名', type: 'String', size: 10 },
      { key: 'mobile', name: '手机号', type: 'String', size: 15 },
      { key: 'sex', name: '性别', type: 'String', size: 10 },
      { key: 'status', name: '状态', type: 'Enum', size: 10, default: StatusDict },
      { key: 'provinceId', name: '省份', type: 'String', size: 10 },
      { key: 'cityId', name: '城市', type: 'String', size: 15 },
      { key: 'districtId', name: '区/县', type: 'String', size: 15 },
      { key: 'address', name: '详细地址', type: 'String', size: 30 },
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
      'attachment; filename=' + encodeURIComponent(`用户地址_${Utils.dayjsFormat('YYYYMMDD')}`) + '.xlsx',// 中文名需要进行 url 转码
    );
    // res.setTimeout(30 * 60 * 1000); // 防止网络原因造成超时。
    res.end(result, 'binary');
  }

  @Post('update')
  @Auth('mall:userAddress:update')
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
  @Auth('mall:userAddress:delete')
  @ApiOperation({ summary: '删除' })
  async delete(@CurUser() curUser, @Body() baseFindByIdDto: BaseFindByIdDto): Promise<any> {
    const { id } = baseFindByIdDto;
    const isExistId = await this.userAddressService.isExistId(id);

    if (!isExistId) {
      throw new BadRequestException(`数据 id：${id} 不存在！`);
    }

    return await this.userAddressService.deleteById(baseFindByIdDto, curUser);
  }

  @Post('deleteBatch')
  @Auth('mall:userAddress:deleteBatch')
  @ApiOperation({ summary: '删除（批量）' })
  async deleteBatch(@CurUser() curUser, @Body() baseFindByIdsDto: BaseFindByIdsDto): Promise<any> {
    return await this.userAddressService.deleteByIds(baseFindByIdsDto, curUser);
  }
}
