import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { CreateUserGroupDto } from './dto/create-user-group.dto';
import { UpdateUserGroupDto } from './dto/update-user-group.dto';
import { UserGroup } from './entities/user-group.entity';
import { BaseFindByIdsDto } from '../base.dto';
import { Utils } from '../../utils';

@Injectable()
export class UserGroupService {
  constructor(
    @InjectRepository(UserGroup)
    private readonly userGroupRepository: Repository<UserGroup>,
  ) {}

  /**
   * 添加
   */
  async insert(dto: UserGroup): Promise<CreateUserGroupDto | UserGroup> {
    return await this.userGroupRepository.save(dto);
  }

  /**
   * 添加（批量）
   */
  async insertBatch(
    dto: UserGroup[],
  ): Promise<CreateUserGroupDto[] | UserGroup[]> {
    return await this.userGroupRepository.save(dto);
  }

  /**
   * 获取用户组（批量）
   */
  async selectByUserIds(baseFindByIdsDto: BaseFindByIdsDto): Promise<UserGroup[]> {
    const { ids } = baseFindByIdsDto;
    const idsArr = Utils.split(ids);
    return await this.userGroupRepository.find({
      relations: ['group'],
      where: {
        id: In(idsArr),
      },
    });
  }

  /**
   * 删除用户组
   */
  async deleteByUserId(id: string): Promise<any> {
    return await this.userGroupRepository
      .createQueryBuilder()
      .delete()
      .from(UserGroup)
      .where('userId = :id', { id: id })
      .execute();
  }
}
