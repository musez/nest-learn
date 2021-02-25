import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { Permission } from '../permission/entities/permission.entity';
import { Utils } from '../../utils';
import { BaseFindByIdDto, BaseFindByPIdDto } from '../base.dto';
import { Menu } from './entities/menu.entity';
import { SearchMenuDto } from './dto/search-menu.dto';
import { LimitMenuDto } from './dto/limit-menu.dto';
import { Area } from '../area/entities/area.entity';

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

    let res = await this.menuRepository.createQueryBuilder()
      .orderBy('createTime', 'ASC')
      .where('name like :name', { name: `%${name}%` })
      .getMany();
    return res;
  }

  async selectListPage(limitMenuDto: LimitMenuDto): Promise<any> {
    let { page, limit, parentId, name } = limitMenuDto;
    page = page ? page : 1;
    limit = limit ? limit : 10;
    let offset = (page - 1) * limit;

    let queryConditionList = [];
    let parentIds = [];
    if (!Utils.isNil(parentId)) {
      parentIds = await this.selectChildrenIdsRecursive(parentId);
      queryConditionList.push('menu.parentId IN (:...parentIds)');
    }
    if (!Utils.isNil(name)) {
      queryConditionList.push('menu.name LIKE :name');
    }
    let queryCondition = queryConditionList.join(' AND ');

    let res = await this.menuRepository.createQueryBuilder('menu')
      // .leftJoinAndSelect('menu', 'p', 'p.id = menu.parentId')
      .leftJoinAndSelect(Menu, 'p', 'p.id = menu.parentId')
      .where(queryCondition, {
        parentIds: parentIds,
        name: `%${name}%`,
      })
      .skip(offset)
      .take(limit)
      .orderBy('menu.createTime', 'ASC')
      .getManyAndCount();

    return {
      list: res[0],
      total: res[1],
      page: page,
      limit: limit,
    };
  }

  async selectChildrenIdsRecursive(id): Promise<any> {
    let list = [];
    list.push(id);
    let childList = await this.menuRepository.find({
      where: {
        parentId: id,
      },
    });

    for (const item of childList) {
      let obj = { ...item };
      await this.selectChildrenIdsRecursive(item.id);
      list.push(obj.id);
    }

    return list;
  }

  async selectListByPId(baseFindByPIdDto: BaseFindByPIdDto): Promise<Menu[]> {
    let { parentId } = baseFindByPIdDto;

    if (Utils.isNil(parentId)) {
      parentId = '-1';
    }

    return await this.menuRepository.find({
      where: {
        parentId: parentId,
      },
    });
  }

  async selectTree(): Promise<any> {
    let res = await this.menuRepository.find();
    return Utils.construct(res, {
      id: 'id',
      pid: 'parentId',
      children: 'children',
    });
  }

  async selectTreeByPId(baseFindByPIdDto: BaseFindByPIdDto): Promise<any> {
    let { parentId } = baseFindByPIdDto;

    if (Utils.isNil(parentId)) {
      let res = await this.menuRepository.find();
      return Utils.construct(res, {
        id: 'id',
        pid: 'parentId',
        children: 'children',
      });
    } else {
      let result = await this.selectChildrenRecursive(parentId);

      return result;
    }
  }

  async selectChildrenRecursive(id): Promise<any> {
    let list = [];
    let childList = await this.menuRepository.find({
      where: {
        parentId: id,
      },
    });

    for (const item of childList) {
      let obj = { ...item };
      let child = await this.selectChildrenRecursive(item.id);
      if (child.length > 0) {
        obj['children'] = child;
        obj['hasChildren'] = true;
      } else {
        obj['children'] = [];
        obj['hasChildren'] = false;
      }
      list.push(obj);
    }

    return list;
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
