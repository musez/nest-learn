import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { UserGroup } from '../user-group/entities/user-group.entity';
import { Role } from './entities/role.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly userGroupRepository: Repository<Role>,
  ) {
  }

  async insert(createRoleDto: CreateRoleDto): Promise<CreateRoleDto> {
    return await this.userGroupRepository.save(createRoleDto);
  }

  async selectList(query): Promise<Role[]> {
    let { name } = query;

    if (!name) {
      name = '';
    }

    return await this.userGroupRepository.find({
      where: {
        name: Like(`%${name}%`),
      },
    });
  }

  async selectListPage(query): Promise<any> {
    let { name, page, limit } = query;
    page = page ? page : 1;
    limit = limit ? limit : 10;
    let offset = (page - 1) * limit;

    if (!name) {
      name = '';
    }

    let res = await this.userGroupRepository.createQueryBuilder('role')
      .skip(offset)
      .take(limit)
      .orderBy('role.createTime', 'ASC')
      .where('role.name like :name', { name: `%${name}%` })
      .getManyAndCount();

    return {
      list: res[0],
      total: res[1],
      page: page,
      limit: limit,
    };
  }

  async selectById(id: string): Promise<Role> {
    return await this.userGroupRepository.findOne(id);
  }

  async update(updateRoleDto: UpdateRoleDto): Promise<void> {
    let { id } = updateRoleDto;

    let isExist = await this.userGroupRepository.findOne(id);
    if (!isExist) {
      throw new BadRequestException(`数据 id = ${id} 不存在！`);
    }

    let role = new Role();

    for (let cityKey in updateRoleDto) {
      if (updateRoleDto[cityKey] !== null && updateRoleDto[cityKey] !== 0) {
        role[cityKey] = updateRoleDto[cityKey];
      }
    }

    await this.userGroupRepository.save(updateRoleDto);
  }

  async deleteById(id: string): Promise<void> {
    let isExist = await this.userGroupRepository.findOne(id);
    if (!isExist) {
      throw new BadRequestException(`数据 id = ${id} 不存在！`);
    }

    await this.userGroupRepository.remove(isExist);
  }
}
