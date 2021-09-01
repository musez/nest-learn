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
  ) {
  }

  /**
   * 添加
   */
  async insert(userGroup: UserGroup): Promise<CreateUserGroupDto | UserGroup> {
    return await this.userGroupRepository.save(userGroup);
  }

  /**
   * 添加（批量）
   */
  async insertBatch(userGroup: UserGroup[],): Promise<CreateUserGroupDto[] | UserGroup[]> {
    return await this.userGroupRepository.save(userGroup);
  }

  /**
   * 获取用户组（批量）
   */
  async selectByUserIds(ids: string[]): Promise<UserGroup[]> {
    return await this.userGroupRepository.find({
      relations: ['group'],
      where: {
        id: In(ids),
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
