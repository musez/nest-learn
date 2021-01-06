import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { CreateUserGroupDto } from './dto/create-user-group.dto';
import { UpdateUserGroupDto } from './dto/update-user-group.dto';
import { UserGroup } from './entities/user-group.entity';

@Injectable()
export class UserGroupService {
  constructor(
    @InjectRepository(UserGroup)
    private readonly userGroupRepository: Repository<UserGroup>,
  ) {
  }

  async insert(CreateUserGroupDto: CreateUserGroupDto): Promise<CreateUserGroupDto> {
    return await this.userGroupRepository.save(CreateUserGroupDto);
  }

  async selectList(query): Promise<UserGroup[]> {
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

  async selectListPage(page, limit, query): Promise<any> {
    let { name } = query;
    page = page ? page : 1;
    limit = limit ? limit : 10;
    let offset = (page - 1) * limit;

    if (!name) {
      name = '';
    }

    let res = await this.userGroupRepository.createQueryBuilder('user_group')
      .skip(offset)
      .take(limit)
      .orderBy('user_group.createTime', 'ASC')
      .where('user_group.name like :name', { name: `%${name}%` })
      .getManyAndCount();

    return {
      list: res[0],
      total: res[1],
      page: page,
      limit: limit,
    };
  }

  async selectById(id: string): Promise<UserGroup> {
    return await this.userGroupRepository.findOne(id);
  }

  async update(updateUserGroupDto: UpdateUserGroupDto): Promise<void> {
    let { id } = updateUserGroupDto;
    let isExist = await this.userGroupRepository.findOne(id);
    if (!isExist) {
      throw new BadRequestException(`数据 id = ${id} 不存在！`);
    }

    let userGroup = new UserGroup();

    for (let cityKey in updateUserGroupDto) {
      if (updateUserGroupDto[cityKey] !== null && updateUserGroupDto[cityKey] !== 0) {
        userGroup[cityKey] = updateUserGroupDto[cityKey];
      }
    }

    await this.userGroupRepository.save(updateUserGroupDto);
  }

  async deleteById(id: string): Promise<void> {
    let isExist = await this.userGroupRepository.findOne(id);
    if (!isExist) {
      throw new BadRequestException(`数据 id = ${id} 不存在！`);
    }

    await this.userGroupRepository.remove(isExist);
  }
}
