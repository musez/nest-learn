import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { BaseFindByIdsDto } from '../base.dto';
import { GroupRole } from './entities/group-role.entity';
import { Utils } from '../../utils';

@Injectable()
export class GroupRoleService {
  constructor(
    @InjectRepository(GroupRole)
    private readonly groupRoleRepository: Repository<GroupRole>,
  ) {
  }

  /**
   * 添加
   */
  async insertBatch(groupRole: GroupRole[]): Promise<GroupRole[]> {
    return await this.groupRoleRepository.save(groupRole);
  }

  /**
   * 获取用户组（批量）
   */
  async selectByGroupIds(ids: string[]): Promise<GroupRole[]> {
    return await this.groupRoleRepository.find({
      relations: ['role'],
      where: {
        id: In(ids),
      },
    });
  }

  /**
   * 删除用户组
   */
  async deleteByGroupId(id: string): Promise<any> {
    return await this.groupRoleRepository
      .createQueryBuilder()
      .delete()
      .from(GroupRole)
      .where('groupId = :id', { id: id })
      .execute();
  }
}
