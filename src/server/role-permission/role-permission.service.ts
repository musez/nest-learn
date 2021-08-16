import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { CreateRolePermissionDto } from './dto/create-role-permission.dto';
import { UpdateRolePermissionDto } from './dto/update-role-permission.dto';
import { RolePermission } from './entities/role-permission.entity';
import { BaseFindByIdsDto } from '../base.dto';
import { UserRole } from '../user-role/entities/user-role.entity';

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
  async insertBatch(dto: RolePermission[]): Promise<RolePermission[]> {
    return await this.rolePermissionRepository.save(dto);
  }

  /**
   * 获取权限
   */
  // async selectByRoleId(baseFindByIdDto: BaseFindByIdDto): Promise<RolePermission[]> {
  //   const { id } = baseFindByIdDto;
  //
  //   return await this.rolePermissionRepository.find({
  //     relations: ['permission'],
  //     where: {
  //       roleId: id,
  //     },
  //   });
  // }

  /**
   * 获取权限（批量）
   */
  async selectByRoleIds(dto: BaseFindByIdsDto): Promise<RolePermission[]> {
    const { ids } = dto;
    return await this.rolePermissionRepository.find({
      relations: ['permission'],
      where: {
        id: In(ids.split(',')),
      },
    });
  }

  /**
   * 删除用户组
   */
  async deleteByRoleId(id: string): Promise<any> {
    return await this.rolePermissionRepository.createQueryBuilder()
      .delete()
      .from(UserRole)
      .where('roleId = :id', { id: id })
      .execute();
  }
}
