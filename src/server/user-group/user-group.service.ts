import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { CreateUserGroupDto } from './dto/create-user-group.dto';
import { UpdateUserGroupDto } from './dto/update-user-group.dto';
import { UserGroup } from './entities/user-group.entity';
import { BaseFindByIdDto } from '../base.dto';
import { UserRole } from '../user-role/entities/user-role.entity';

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
  async insert(dto: UserGroup): Promise<CreateUserGroupDto | UserGroup> {
    return await this.userGroupRepository.save(dto);
  }

  /**
   * 添加（批量）
   */
  async insertBatch(dto: UserGroup[]): Promise<CreateUserGroupDto[] | UserGroup[]> {
    return await this.userGroupRepository.save(dto);
  }

  /**
   * 获取用户组
   */
  async selectByUserId(baseFindByIdDto: BaseFindByIdDto): Promise<UserGroup[]> {
    return await this.userGroupRepository.find({
      // relations: ['group'],
      where: {
        userId: baseFindByIdDto,
      },
    });
  }

  /**
   * 删除用户组
   */
  async deleteByUserId(id: string): Promise<any> {
    return await this.userGroupRepository.createQueryBuilder()
      .delete()
      .from(UserRole)
      .where('userId = :id', { id: id })
      .execute();
  }
}
