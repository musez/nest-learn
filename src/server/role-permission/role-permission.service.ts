import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { CreateRolePermissionDto } from './dto/create-role-permission.dto';
import { UpdateRolePermissionDto } from './dto/update-role-permission.dto';
import { RolePermission } from './entities/role-permission.entity';
import { CreateGroupRoleDto } from '../group-role/dto/create-group-role.dto';
import { BaseFindByIdDto } from '../base.dto';
import { GroupRole } from '../group-role/entities/group-role.entity';
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
  async insertBatch(createRolePermissionDto: CreateRolePermissionDto[]): Promise<CreateRolePermissionDto[]> {
    return await this.rolePermissionRepository.save(createRolePermissionDto);
  }

  /**
   * 获取权限
   */
  async selectByRoleId(baseFindByIdDto: BaseFindByIdDto): Promise<RolePermission[]> {
    return await this.rolePermissionRepository.find({
      // relations: ['permission'],
      where: {
        roleId: baseFindByIdDto,
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
