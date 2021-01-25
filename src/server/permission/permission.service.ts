import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, TreeRepository } from 'typeorm';
import { Utils } from './../../utils/index';
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

  async selectListPage(query): Promise<any> {
    let { page, limit, parentId, name } = query;

    page = page ? page : 1;
    limit = limit ? limit : 10;
    let offset = (page - 1) * limit;


    if (Utils.isEmpty(name)) {
      name = '';
    }

    let res = [];
    if (parentId) {
      let isExist = await this.permissionRepository.findOne(parentId);
      if (Utils.isEmpty(isExist)) {
        throw new BadRequestException(`数据 parentId：${parentId} 不存在！`);
      }

      res = await this.permissionRepository.createDescendantsQueryBuilder('permission', 'permissionClosure', isExist)
        .andWhere('name like :name', {
          name: `%${name}%`,
        })
        .skip(offset)
        .take(limit)
        .orderBy('permission.createTime', 'ASC')
        .getManyAndCount();
    } else {
      res = await this.permissionRepository.createQueryBuilder('permission')
        .andWhere('name like :name', {
          name: `%${name}%`,
        })
        .skip(offset)
        .take(limit)
        .orderBy('permission.createTime', 'ASC')
        .getManyAndCount();
    }

    return {
      list: res[0],
      total: res[1],
      page: page,
      limit: limit,
    };
  }

  async selectListByPId(parentId: string): Promise<Permission[]> {
    let isExist = await this.permissionRepository.findOne(parentId);
    if (Utils.isEmpty(isExist)) {
      throw new BadRequestException(`数据 parentId：${parentId} 不存在！`);
    }

    return await this.permissionRepository.createDescendantsQueryBuilder('permission', 'permissionClosure', isExist)
      .getMany();
  }

  async selectTree(): Promise<Permission[]> {
    return await this.permissionRepository.findTrees();
  }

  async selectTreeByPId(parentId: string): Promise<any> {
    if (parentId) {
      let isExist = await this.permissionRepository.findOne(parentId);
      if (Utils.isEmpty(isExist)) {
        throw new BadRequestException(`数据 parentId：${parentId} 不存在！`);
      }

      return await this.permissionRepository.findDescendantsTree(isExist);
    } else {
      return await this.permissionRepository.findTrees();
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
    if (Utils.isEmpty(isExist)) {
      throw new BadRequestException(`数据 id：${id} 不存在！`);
    }

    return await this.permissionRepository.save(isExist);
  }
}
