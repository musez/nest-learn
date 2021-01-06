import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, TreeRepository } from 'typeorm';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { Permission } from './entities/permission.entity';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { BaseFindByIdDto } from '../base.dto';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: TreeRepository<Permission>,
  ) {
  }

  async insert(createPermissionDto: CreatePermissionDto): Promise<Permission> {
    let { parentId, ...result } = createPermissionDto;

    let child = new Permission();
    for (let key in result) {
      child[key] = result[key];
    }

    let parent = await this.permissionRepository.findOne(parentId);
    if (parent) {
      child.parent = parent;
    }

    return await this.permissionRepository.save(child);
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

  async selectById(baseFindByIdDto: BaseFindByIdDto): Promise<Permission> {
    let { id } = baseFindByIdDto;
    return await this.permissionRepository.findOne(id);
  }

  async update(updatePermissionDto: UpdatePermissionDto) {
    let { id, parentId, ...result } = updatePermissionDto;

    let child = new Permission();
    for (let key in result) {
      child[key] = result[key];
    }

    let parent = await this.permissionRepository.findOne(parentId);
    if (parent) {
      child.parent = parent;
    }

    let isExist = await this.permissionRepository.findOne(id);
    if (!isExist) {
      throw new BadRequestException(`数据 id = ${id} 不存在！`);
    }

    return await this.permissionRepository.save(isExist);
  }
}
