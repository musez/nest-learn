import { Injectable } from '@nestjs/common';
import { BaseFindByIdDto, BaseFindByIdsDto } from '../base.dto';
import { Utils } from '../../utils';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { GroupPermission } from './entities/group-permission.entity';

@Injectable()
export class GroupPermissionService {
  constructor(
    @InjectRepository(GroupPermission)
    private readonly groupPermissionRepository: Repository<GroupPermission>,
  ) {
  }

  /**
   * 添加
   */
  async insertBatch(groupPermission: GroupPermission[]): Promise<GroupPermission[]> {
    return await this.groupPermissionRepository.save(groupPermission);
  }

  /**
   * 获取权限
   */
  async selectByGroupId(baseFindByIdDto: BaseFindByIdDto): Promise<GroupPermission[]> {
    const { id } = baseFindByIdDto;
    const ret = await this.groupPermissionRepository.find({
      relations: ['permission'],
      where: {
        userId: id,
      },
    });

    return ret;
  }

  /**
   * 获取权限（批量）
   */
  async selectByGroupIds(ids: string[]): Promise<GroupPermission[]> {
    return await this.groupPermissionRepository.find({
      relations: ['permission'],
      where: {
        id: In(ids),
      },
    });
  }

  /**
   * 删除权限
   */
  async deleteByGroupId(id: string): Promise<any> {
    return await this.groupPermissionRepository
      .createQueryBuilder()
      .delete()
      .from(GroupPermission)
      .where('groupId = :id', { id: id })
      .execute();
  }
}
