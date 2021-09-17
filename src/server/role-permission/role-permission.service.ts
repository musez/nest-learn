import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { RolePermission } from './entities/role-permission.entity';
import { UserRole } from '../user-role/entities/user-role.entity';
import { ApiException } from '../../common/exception/api-exception';
import { ApiErrorCode } from '../../constants/api-error-code.enum';

@Injectable()
export class RolePermissionService {
  constructor(
    @InjectRepository(RolePermission)
    private readonly rolePermissionRepository: Repository<RolePermission>,
  ) {
  }

  /**
   * 添加
   */
  async insertBatch(rolePermission: RolePermission[]): Promise<RolePermission[]> {
    try {
      return await this.rolePermissionRepository.save(rolePermission);
    } catch (e) {
       throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  /**
   * 获取权限（批量，角色 id）
   */
  async selectByRoleIds(ids: string[]): Promise<RolePermission[]> {
    try {
      return await this.rolePermissionRepository.find({
        relations: ['permission'],
        where: {
          id: In(ids),
        },
      });
    } catch (e) {
       throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  /**
   * 删除（角色 id）
   */
  async deleteByRoleId(id: string): Promise<any> {
    try {
      return await this.rolePermissionRepository
        .createQueryBuilder()
        .delete()
        .from(UserRole)
        .where('roleId = :id', { id: id })
        .execute();
    } catch (e) {
       throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }
}
