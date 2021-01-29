import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { Permission } from '../permission/entities/permission.entity';
import { Utils } from '../../utils';
import { BaseFindByIdDto } from '../base.dto';
import { Menu } from './entities/menu.entity';
import { SearchMenuDto } from './dto/search-menu.dto';
import { LimitMenuDto } from './dto/limit-menu.dto';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Menu)
    private readonly menuRepository: Repository<Menu>,
  ) {
  }

  async insert(createMenuDto: CreateMenuDto, curUser?): Promise<CreateMenuDto> {
    let role = new Menu();
    role = Utils.dto2entity(createMenuDto, role);
    role.createBy = curUser.id;
    return await this.menuRepository.save(role);
  }

  async selectList(searchMenuDto: SearchMenuDto): Promise<Menu[]> {
    let { name } = searchMenuDto;

    if (Utils.isNil(name)) {
      name = '';
    }

    return await this.menuRepository.find({
      where: {
        name: Like(`%${name}%`),
      },
    });
  }

  async selectListPage(limitMenuDto: LimitMenuDto): Promise<any> {
    let { page, limit, name } = limitMenuDto;
    page = page ? page : 1;
    limit = limit ? limit : 10;
    let offset = (page - 1) * limit;

    if (Utils.isNil(name)) {
      name = '';
    }

    let res = await this.menuRepository.createQueryBuilder('role')
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

  async selectById(baseFindByIdDto: BaseFindByIdDto): Promise<Menu> {
    let { id } = baseFindByIdDto;
    return await this.menuRepository.findOne(id);
  }

  async update(updateMenuDto: UpdateMenuDto, curUser?): Promise<void> {
    let { id } = updateMenuDto;

    let isExist = await this.menuRepository.findOne(id);
    if (Utils.isNil(isExist)) {
      throw new BadRequestException(`数据 id：${id} 不存在！`);
    }

    let role = new Menu();
    role = Utils.dto2entity(updateMenuDto, role);
    role.updateBy = curUser.id;

    await this.menuRepository.save(role);
  }

  async deleteById(baseFindByIdDto: BaseFindByIdDto): Promise<void> {
    let { id } = baseFindByIdDto;
    let isExist = await this.menuRepository.findOne(id);
    if (Utils.isNil(isExist)) {
      throw new BadRequestException(`数据 id：${id} 不存在！`);
    }

    await this.menuRepository.remove(isExist);
  }
}
