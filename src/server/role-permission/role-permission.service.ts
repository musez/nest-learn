import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { CreateRolePermissionDto } from './dto/create-role-permission.dto';
import { UpdateRolePermissionDto } from './dto/update-role-permission.dto';
import { RolePermission } from './entities/role-permission.entity';
import { CreateGroupRoleDto } from '../group-role/dto/create-group-role.dto';
import { BaseFindByIdDto } from '../base.dto';
import { GroupRole } from '../group-role/entities/group-role.entity';

@Injectable()
export class RolePermissionService {
  constructor(
    @InjectRepository(RolePermission)
    private readonly rolePermissionRepository: Repository<RolePermission>,
  ) {
  }

  async insert(createRolePermissionDto: CreateRolePermissionDto[]): Promise<CreateRolePermissionDto[]> {
    return await this.rolePermissionRepository.save(createRolePermissionDto);
  }

  async selectByRoleId(baseFindByIdDto: BaseFindByIdDto): Promise<RolePermission[]> {
    return await this.rolePermissionRepository.find({
      relations: ['permission'],
      where: {
        roleId: baseFindByIdDto,
      },
    });
  }
}
