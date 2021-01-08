import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { Group } from './entities/group.entity';

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
  ) {
  }

  async insert(CreateGroupDto: CreateGroupDto): Promise<CreateGroupDto> {
    return await this.groupRepository.save(CreateGroupDto);
  }

  async selectList(query): Promise<Group[]> {
    let { name } = query;

    if (!name) {
      name = '';
    }

    return await this.groupRepository.find({
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

    let res = await this.groupRepository.createQueryBuilder('user_group')
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

  async selectById(id: string): Promise<Group> {
    return await this.groupRepository.findOne(id);
  }

  async update(updateGroupDto: UpdateGroupDto): Promise<void> {
    let { id } = updateGroupDto;
    let isExist = await this.groupRepository.findOne(id);
    if (!isExist) {
      throw new BadRequestException(`数据 id = ${id} 不存在！`);
    }

    let group = new Group();

    for (let cityKey in updateGroupDto) {
      if (updateGroupDto[cityKey] !== null && updateGroupDto[cityKey] !== 0) {
        group[cityKey] = updateGroupDto[cityKey];
      }
    }

    await this.groupRepository.save(updateGroupDto);
  }

  async deleteById(id: string): Promise<void> {
    let isExist = await this.groupRepository.findOne(id);
    if (!isExist) {
      throw new BadRequestException(`数据 id = ${id} 不存在！`);
    }

    await this.groupRepository.remove(isExist);
  }
}
