import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, TreeRepository } from 'typeorm';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { Permission } from './entities/permission.entity';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: TreeRepository<Permission>,
  ) {
  }

  async insert(permission: Permission): Promise<Permission> {
    return await this.permissionRepository.save(permission);
  }

  async selectList(): Promise<Permission[]> {
    return await this.permissionRepository.find();
  }

  async selectTree(): Promise<Permission[]> {
    return await this.permissionRepository.findTrees();
  }

  async selectTreeChild(parent: Permission): Promise<Permission[]> {
    if (parent) {
      return await this.permissionRepository.findDescendants(parent);
    } else {
      return await this.permissionRepository.findRoots();
    }
  }

  async findOne(id: string) {
    return await this.permissionRepository.findOne(id);
  }

  update(id: number, updatePermissionDto: UpdatePermissionDto) {
    return `This action updates a #${id} permission`;
  }

  remove(id: number) {
    return `This action removes a #${id} permission`;
  }
}
