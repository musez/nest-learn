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

  async insert(createPermissionDto: CreatePermissionDto): Promise<CreatePermissionDto> {
    return await this.permissionRepository.save(createPermissionDto);
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

  findOne(id: number) {
    return `This action returns a #${id} permission`;
  }

  update(id: number, updatePermissionDto: UpdatePermissionDto) {
    return `This action updates a #${id} permission`;
  }

  remove(id: number) {
    return `This action removes a #${id} permission`;
  }
}
