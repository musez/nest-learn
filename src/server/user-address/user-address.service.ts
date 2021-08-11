import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserAddressDto } from './dto/create-user-address.dto';
import { UpdateUserAddressDto } from './dto/update-user-address.dto';
import { Utils } from '../../utils';
import { BaseFindByIdDto, BaseFindByIdsDto, BaseModifyStatusByIdsDto } from '../base.dto';
import { UserAddress } from './entities/user-address.entity';
import { SearchUserAddressDto } from './dto/search-user-address.dto';
import { LimitUserAddressDto } from './dto/limit-user-address.dto';
import { UserService } from '../user/user.service';
import { ApiException } from 'src/common/exception/api-exception';

@Injectable()
export class UserAddressService {
  constructor(
    private readonly userService: UserService,
    @InjectRepository(UserAddress)
    private readonly repository: Repository<UserAddress>,
  ) {
  }

  /**
   * 添加
   */
  async insert(createDto: CreateUserAddressDto, curUser): Promise<CreateUserAddressDto | UserAddress> {
    let userAddress = new UserAddress();
    userAddress = Utils.dto2entity(createDto, userAddress);

    const ret = await this.userService.selectById({ id: createDto.userId });
    userAddress.user = ret;

    return await this.repository.save(userAddress);
  }

  /**
   * 获取列表
   */
  async selectList(searchDto: SearchUserAddressDto): Promise<any[]> {
    const { name, mobile } = searchDto;

    const queryConditionList = [];
    if (!Utils.isBlank(name)) {
      queryConditionList.push('name LIKE :name');
    }
    if (!Utils.isBlank(mobile)) {
      queryConditionList.push('mobile LIKE :mobile');
    }
    queryConditionList.push('deleteStatus = 0');
    const queryCondition = queryConditionList.join(' AND ');

    return await this.repository.createQueryBuilder()
      .where(queryCondition, {
        name: `%${name}%`,
        mobile: `%${mobile}%`,
      })
      .orderBy({ 'createTime': 'DESC' })
      .getMany();
  }

  /**
   * 获取列表（分页）
   */
  async selectListPage(limitDto: LimitUserAddressDto): Promise<any> {
    // eslint-disable-next-line prefer-const
    let { page, limit, name, mobile } = limitDto;
    page = page ? page : 1;
    limit = limit ? limit : 10;
    const offset = (page - 1) * limit;

    const queryConditionList = [];
    if (!Utils.isBlank(name)) {
      queryConditionList.push('name LIKE :name');
    }
    if (!Utils.isBlank(mobile)) {
      queryConditionList.push('mobile LIKE :mobile');
    }
    queryConditionList.push('deleteStatus = 0');
    const queryCondition = queryConditionList.join(' AND ');

    const res = await this.repository.createQueryBuilder()
      .where(queryCondition, {
        name: `%${name}%`,
        mobile: `%${mobile}%`,
      })
      .skip(offset)
      .take(limit)
      .orderBy({ 'createTime': 'DESC' })
      .getManyAndCount();

    return {
      list: res[0],
      total: res[1],
      page: page,
      limit: limit,
    };
  }

  /**
   * 获取详情（主键 id）
   */
  async selectById(baseFindByIdDto: BaseFindByIdDto): Promise<UserAddress> {
    const { id } = baseFindByIdDto;
    return await this.repository.findOne(id);
  }

  /**
   * 是否存在（主键 id）
   */
  async isExistId(id: string): Promise<boolean> {
    const isExist = await this.repository.findOne(id);
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

    await this.repository.update(id, userAddress);
  }

  /**
   * 删除
   */
  async deleteById(baseFindByIdDto: BaseFindByIdDto, curUser): Promise<void> {
    const { id } = baseFindByIdDto;

    await this.repository.createQueryBuilder()
      .update(UserAddress)
      .set({ deleteStatus: 1, deleteBy: curUser!.id, deleteTime: Utils.now() })
      .where('id = :id', { id: id })
      .execute();
  }

  /**
   * 删除（批量）
   */
  async deleteByIds(baseFindByIdsDto: BaseFindByIdsDto, curUser): Promise<void> {
    const { ids } = baseFindByIdsDto;

    const ret = await this.repository.createQueryBuilder()
      .update(UserAddress)
      .set({ deleteStatus: 1, deleteBy: curUser!.id, deleteTime: Utils.now() })
      .where('ids in (:ids)', { ids: ids })
      .execute();

    if (!ret) {
      throw new ApiException('删除异常！',500);
    }

    return null;
  }
}
