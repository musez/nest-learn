import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserAddressDto } from './dto/create-user-address.dto';
import { UpdateUserAddressDto } from './dto/update-user-address.dto';
import { Utils } from '../../utils';
import {
  BaseFindByIdDto,
  BaseFindByIdsDto,
  BaseModifyStatusByIdsDto,
} from '../base.dto';
import { UserAddress } from './entities/user-address.entity';
import { SearchUserAddressDto } from './dto/search-user-address.dto';
import { LimitUserAddressDto } from './dto/limit-user-address.dto';
import { UserService } from '../user/user.service';
import { ApiException } from '../../common/exception/api-exception';
import { Area } from '../area/entities/area.entity';

@Injectable()
export class UserAddressService {
  constructor(
    private readonly userService: UserService,
    @InjectRepository(UserAddress)
    private readonly userAddressRepository: Repository<UserAddress>,
  ) {
  }

  /**
   * 添加
   */
  async insert(
    createDto: CreateUserAddressDto,
    curUser,
  ): Promise<CreateUserAddressDto | UserAddress> {
    let userAddress = new UserAddress();
    userAddress = Utils.dto2entity(createDto, userAddress);

    const ret = await this.userService.selectById({ id: curUser.id });
    userAddress.user = ret;

    return await this.userAddressRepository.save(userAddress);
  }

  /**
   * 获取列表
   */
  async selectList(searchDto: SearchUserAddressDto): Promise<any[]> {
    const { name, mobile, status } = searchDto;

    const queryConditionList = [];
    if (!Utils.isBlank(name)) {
      queryConditionList.push('userAddress.name LIKE :name');
    }
    if (!Utils.isBlank(mobile)) {
      queryConditionList.push('userAddress.mobile LIKE :mobile');
    }
    if (!Utils.isBlank(status)) {
      queryConditionList.push('userAddress.status LIKE :status');
    }
    queryConditionList.push('userAddress.deleteStatus = 0');
    const queryCondition = queryConditionList.join(' AND ');

    const ret = await this.userAddressRepository
      .createQueryBuilder('userAddress')
      // .leftJoinAndSelect('userAddress.user', 'user')
      .leftJoinAndSelect(Area, 'p', 'p.id = userAddress.provinceId')
      .leftJoinAndSelect(Area, 'c', 'c.id = userAddress.cityId')
      .leftJoinAndSelect(Area, 'd', 'd.id = userAddress.districtId')
      .select(
        'userAddress.*, userAddress.provinceId, userAddress.cityId, userAddress.districtId, userAddress.address ',
      )
      .addSelect(
        `p.areaName AS provinceName, c.areaName AS cityName, d.areaName AS districtName`,
      )
      .where(queryCondition, {
        name: `%${name}%`,
        mobile: `%${mobile}%`,
        status: status,
      })
      .orderBy({
        'userAddress.status': 'DESC',
        'userAddress.createTime': 'DESC',
      })
      .getRawMany();

    ret.forEach((v) => {
      const ui = {
        provinceId: v.provinceId,
        cityId: v.cityId,
        districtId: v.districtId,
        address: v.address,
        provinceName: v.provinceName,
        cityName: v.cityName,
        districtName: v.districtName,
      };
      v['userAddress'] = ui;

      delete v.provinceId;
      delete v.cityId;
      delete v.address;
      delete v.provinceName;
      delete v.cityName;
      delete v.districtName;
    });

    if (!ret) {
      throw new ApiException('查询异常！', 500);
    }

    return ret;
  }

  /**
   * 获取列表（分页）
   */
  async selectListPage(limitDto: LimitUserAddressDto): Promise<any> {
    // eslint-disable-next-line prefer-const
    let { page, limit, name, mobile, status } = limitDto;
    page = page ? page : 1;
    limit = limit ? limit : 10;
    const offset = (page - 1) * limit;

    const queryConditionList = [];
    if (!Utils.isBlank(name)) {
      queryConditionList.push('userAddress.name LIKE :name');
    }
    if (!Utils.isBlank(mobile)) {
      queryConditionList.push('userAddress.mobile LIKE :mobile');
    }
    if (!Utils.isBlank(status)) {
      queryConditionList.push('userAddress.status LIKE :status');
    }
    queryConditionList.push('userAddress.deleteStatus = 0');
    const queryCondition = queryConditionList.join(' AND ');

    const queryBuilder = this.userAddressRepository
      .createQueryBuilder('userAddress')
      // .leftJoinAndSelect('userAddress.user', 'user')
      .leftJoinAndSelect(Area, 'p', 'p.id = userAddress.provinceId')
      .leftJoinAndSelect(Area, 'c', 'c.id = userAddress.cityId')
      .leftJoinAndSelect(Area, 'd', 'd.id = userAddress.districtId')
      .select(
        'userAddress.*, userAddress.provinceId, userAddress.cityId, userAddress.districtId, userAddress.address ',
      )
      .addSelect(
        `p.areaName AS provinceName, c.areaName AS cityName, d.areaName AS districtName`,
      )
      .where(queryCondition, {
        name: `%${name}%`,
        mobile: `%${mobile}%`,
        status: status,
      });

    const ret = await queryBuilder
      // .skip(offset)
      // .take(limit)
      .offset(offset)
      .limit(limit)
      .orderBy({
        'userAddress.status': 'DESC',
        'userAddress.createTime': 'DESC',
      })
      .getRawMany();

    ret.forEach((v) => {
      const ui = {
        provinceId: v.provinceId,
        cityId: v.cityId,
        districtId: v.districtId,
        address: v.address,
        provinceName: v.provinceName,
        cityName: v.cityName,
        districtName: v.districtName,
      };
      v['userAddress'] = ui;

      delete v.provinceId;
      delete v.cityId;
      delete v.address;
      delete v.provinceName;
      delete v.cityName;
      delete v.districtName;
    });

    const retCount = await queryBuilder.getCount();

    if (!ret) {
      throw new ApiException('查询异常！', 500);
    }

    return {
      list: ret,
      total: retCount,
      page: page,
      limit: limit,
    };
  }

  /**
   * 获取详情（主键 id）
   */
  async selectById(baseFindByIdDto: BaseFindByIdDto): Promise<UserAddress> {
    const { id } = baseFindByIdDto;
    return await this.userAddressRepository.findOne(id);
  }

  /**
   * 是否存在（主键 id）
   */
  async isExistId(id: string): Promise<boolean> {
    const isExist = await this.userAddressRepository.findOne(id);
    if (Utils.isNil(isExist)) {
      return false;
    } else {
      return true;
    }
  }

  /**
   * 修改
   */
  async update(updateDto: UpdateUserAddressDto, curUser): Promise<void> {
    const { id } = updateDto;

    let userAddress = new UserAddress();
    userAddress = Utils.dto2entity(updateDto, userAddress);

    await this.userAddressRepository.update(id, userAddress);
  }

  /**
   * 修改状态
   */
  async updateStatus(
    baseModifyStatusByIdsDto: BaseModifyStatusByIdsDto,
    curUser,
  ): Promise<any> {
    const { ids, status } = baseModifyStatusByIdsDto;

    const ret = this.userAddressRepository
      .createQueryBuilder()
      .update(UserAddress)
      .set({ status: status, updateBy: curUser!.id })
      .where('id in (:ids)', { ids: ids })
      .execute();

    if (!ret) {
      throw new ApiException('更新异常！', 500);
    }

    return ret;
  }

  /**
   * 删除
   */
  async deleteById(baseFindByIdDto: BaseFindByIdDto, curUser): Promise<void> {
    const { id } = baseFindByIdDto;

    await this.userAddressRepository
      .createQueryBuilder()
      .update(UserAddress)
      .set({ deleteStatus: 1, deleteBy: curUser!.id, deleteTime: Utils.now() })
      .where('id = :id', { id: id })
      .execute();
  }

  /**
   * 删除（批量）
   */
  async deleteByIds(
    baseFindByIdsDto: BaseFindByIdsDto,
    curUser,
  ): Promise<void> {
    const { ids } = baseFindByIdsDto;

    const ret = await this.userAddressRepository
      .createQueryBuilder()
      .update(UserAddress)
      .set({ deleteStatus: 1, deleteBy: curUser!.id, deleteTime: Utils.now() })
      .where('ids in (:ids)', { ids: ids })
      .execute();

    if (!ret) {
      throw new ApiException('删除异常！', 500);
    }

    return null;
  }
}
