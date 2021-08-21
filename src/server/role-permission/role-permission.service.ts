import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { RolePermission } from './entities/role-permission.entity';
import { BaseFindByIdsDto } from '../base.dto';
import { UserRole } from '../user-role/entities/user-role.entity';
import { Utils } from '../../utils';

@Injectable()
export class RolePermissionService {
  constructor(
    @InjectRepository(RolePermission)
    private readonly rolePermissionRepository: Repository<RolePermission>,
  ) {}

  /**
   * 添加
   */
  async insertBatch(rolePermission: RolePermission[]): Promise<RolePermission[]> {
    return await this.rolePermissionRepository.save(rolePermission);
  }

  /**
   * 获取权限（批量）
   */
  async selectByRoleIds(baseFindByIdsDto: BaseFindByIdsDto): Promise<RolePermission[]> {
    const { ids } = baseFindByIdsDto;
    const idsArr = Utils.split(ids);
    return await this.rolePermissionRepository.find({
      relations: ['permission'],
      where: {
        id: In(idsArr),
      },
    });
  }

  /**
   * 删除用户组
   */
  async deleteByRoleId(id: string): Promise<any> {
    return await this.rolePermissionRepository
      .createQueryBuilder()
      .delete()
      .from(UserRole)
      .where('roleId = :id', { id: id })
      .execute();
  }
}
