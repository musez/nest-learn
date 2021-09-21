import { HttpStatus, Injectable } from '@nestjs/common';
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
import { ApiErrorCode } from '../../constants/api-error-code.enum';

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
  async insert(createDto: CreateUserAddressDto, curUser?): Promise<CreateUserAddressDto | UserAddress> {
    let userAddress = new UserAddress();
    userAddress = Utils.dto2entity(createDto, userAddress);

    const ret = await this.userService.selectById({ id: curUser ? curUser.id : null });
    userAddress.user = ret;

    return await this.userAddressRepository.save(userAddress);
  }

  /**
   * 获取列表
   */
  async selectList(searchDto: SearchUserAddressDto): Promise<any[]> {
    // eslint-disable-next-line prefer-const
    let { name, mobile, status } = searchDto;

    const queryConditionList = [];
    if (!Utils.isBlank(name)) {
      queryConditionList.push('userAddress.name LIKE :name');
    }
    if (!Utils.isBlank(mobile)) {
      queryConditionList.push('userAddress.mobile LIKE :mobile');
    }
    if (!Utils.isBlank(status)) {
      if (!Utils.isArray(status)) {
        // @ts-ignore
        status = Utils.split(status.toString());
      }
      queryConditionList.push('userAddress.status IN (:status)');
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
        'userAddress.*',
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

    if (!ret) {
      throw new ApiException('查询异常！', ApiErrorCode.ERROR, HttpStatus.OK);
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
      if (!Utils.isArray(status)) {
        // @ts-ignore
        status = Utils.split(status.toString());
      }
      queryConditionList.push('userAddress.status IN (:status)');
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
        'userAddress.*',
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

    const retCount = await queryBuilder.getCount();

    if (!ret) {
      throw new ApiException('查询异常！', ApiErrorCode.ERROR, HttpStatus.OK);
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
    return await this.userAddressRepository.findOne({
      relations: ['user'],
      where: {
        id: id,
      },
    });
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
  async update(updateDto: UpdateUserAddressDto, curUser?): Promise<void> {
    const { id } = updateDto;

    let userAddress = new UserAddress();
    userAddress = Utils.dto2entity(updateDto, userAddress);

    await this.userAddressRepository.update(id, userAddress);
  }

  /**
   * 修改状态
   */
  async updateStatus(baseModifyStatusByIdsDto: BaseModifyStatusByIdsDto, curUser?): Promise<any> {
    // eslint-disable-next-line prefer-const
    let { ids, status } = baseModifyStatusByIdsDto;
    if (!Utils.isArray(ids)) {
      ids = Utils.split(ids.toString());
    }
    const ret = this.userAddressRepository
      .createQueryBuilder()
      .update(UserAddress)
      .set({ status: status, updateBy: curUser ? curUser!.id : null })
      .where('id IN (:ids)', { ids: ids })
      .execute();

    if (!ret) {
      throw new ApiException('更新异常！', ApiErrorCode.ERROR, HttpStatus.OK);
    }

    return ret;
  }

  /**
   * 删除
   */
  async deleteById(baseFindByIdDto: BaseFindByIdDto, curUser?): Promise<void> {
    const { id } = baseFindByIdDto;

    await this.userAddressRepository
      .createQueryBuilder()
      .update(UserAddress)
      .set({ deleteStatus: 1, deleteBy: curUser ? curUser!.id : null, deleteTime: Utils.now() })
      .where('id = :id', { id: id })
      .execute();
  }

  /**
   * 删除（批量）
   */
  async deleteByIds(baseFindByIdsDto: BaseFindByIdsDto, curUser?): Promise<void> {
    let { ids } = baseFindByIdsDto;

    if (!Utils.isArray(ids)) {
      ids = Utils.split(ids.toString());
    }
    const ret = await this.userAddressRepository
      .createQueryBuilder()
      .update(UserAddress)
      .set({ deleteStatus: 1, deleteBy: curUser ? curUser!.id : null, deleteTime: Utils.now() })
      .where('id IN (:ids)', { ids: ids })
      .execute();

    if (!ret) {
      throw new ApiException('删除异常！', ApiErrorCode.ERROR, HttpStatus.OK);
    }

    return null;
  }
}
