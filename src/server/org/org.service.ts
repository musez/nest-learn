import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { CreateOrgDto } from './dto/create-org.dto';
import { UpdateOrgDto } from './dto/update-org.dto';
import { Org } from './entities/org.entity';
import { Utils } from '../../utils';
import { SearchOrgDto } from './dto/search-org.dto';
import { LimitOrgDto } from './dto/limit-org.dto';
import { BaseFindByIdDto, BaseFindByPIdDto } from '../base.dto';
import { Permission } from '../permission/entities/permission.entity';

@Injectable()
export class OrgService {
  constructor(
    @InjectRepository(Org)
    private readonly orgRepository: Repository<Org>,
  ) {
  }

  /**
   * 添加
   */
  async insert(createOrgDto: CreateOrgDto, curUser?): Promise<CreateOrgDto> {
    let role = new Org();
    role = Utils.dto2entity(createOrgDto, role);
    role.createBy = curUser.id;
    return await this.orgRepository.save(role);
  }

  /**
   * 获取列表
   */
  async selectList(searchOrgDto: SearchOrgDto): Promise<Org[]> {
    let { parentId, kinship, name } = searchOrgDto;

    kinship = kinship ? kinship : 0;

    let queryConditionList = [];

    let parentIds = null;
    if (!Utils.isBlank(parentId)) {
      if (kinship === 0) {
        parentIds = parentId;
        queryConditionList.push('parentId = :parentIds');
      } else {
        parentIds = await this.selectChildrenIdsRecursive(parentId);
        queryConditionList.push('parentId IN (:...parentIds)');
      }
    } else {
      queryConditionList.push('parentId IS NULL');
    }

    if (!Utils.isBlank(name)) {
      queryConditionList.push('name LIKE :name');
    }
    let queryCondition = queryConditionList.join(' AND ');

    let res = await this.orgRepository.createQueryBuilder('o')
      .select(['o.*'])
      .addSelect(subQuery  =>
        subQuery .select('COUNT(*)')
          .from(Permission, 'subO')
          .where('subO.parentId = o.id'), 'hasChildren')
      .orderBy('createTime', 'ASC')
      .where(queryCondition, {
        parentIds: parentIds,
        name: `%${name}%`,
      })
      .getRawMany();
    return res;
  }

  /**
   * 获取列表（分页）
   */
  async selectListPage(limitOrgDto: LimitOrgDto): Promise<any> {
    let { page, limit, parentId, name } = limitOrgDto;
    page = page ? page : 1;
    limit = limit ? limit : 10;
    let offset = (page - 1) * limit;

    let queryConditionList = [];
    let parentIds = [];
    if (!Utils.isBlank(parentId)) {
      parentIds = await this.selectChildrenIdsRecursive(parentId);
      queryConditionList.push('org.parentId IN (:...parentIds)');
    }
    if (!Utils.isBlank(name)) {
      queryConditionList.push('org.name LIKE :name');
    }
    let queryCondition = queryConditionList.join(' AND ');

    let res = await this.orgRepository.createQueryBuilder('org')
      .leftJoinAndSelect(Org, 'p', 'p.id = org.parentId')
      .where(queryCondition, {
        parentIds: parentIds,
        name: `%${name}%`,
      })
      .skip(offset)
      .take(limit)
      .orderBy('org.createTime', 'ASC')
      .getManyAndCount();

    return {
      list: res[0],
      total: res[1],
      page: page,
      limit: limit,
    };
  }

  /**
   * 递归查询（ids）
   */
  async selectChildrenIdsRecursive(id): Promise<any> {
    let list = [];
    list.push(id);
    let childList = await this.orgRepository.find({
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

  /**
   * 获取树
   */
  async selectTree(baseFindByPIdDto: BaseFindByPIdDto): Promise<any> {
    let { parentId } = baseFindByPIdDto;

    if (Utils.isBlank(parentId)) {
      let res = await this.orgRepository.find();
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

  /**
   * 递归查询（id）
   */
  async selectChildrenRecursive(id): Promise<any> {
    let list = [];
    let childList = await this.orgRepository.find({
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

  /**
   * 获取详情（主键 id）
   */
  async selectById(baseFindByIdDto: BaseFindByIdDto): Promise<Org> {
    let { id } = baseFindByIdDto;
    return await this.orgRepository.findOne(id);
  }

  /**
   * 是否存在（主键 id）
   */
  async isExistId(id: string): Promise<Boolean> {
    let isExist = await this.orgRepository.findOne(id);
    if (Utils.isNil(isExist)) {
      throw false;
    } else {
      return true;
    }
  }

  /**
   * 修改
   */
  async update(updateOrgDto: UpdateOrgDto, curUser?): Promise<void> {
    let { id } = updateOrgDto;

    let org = new Org();
    org = Utils.dto2entity(updateOrgDto, org);
    org.updateBy = curUser.id;

    await this.orgRepository.update(id, org);
  }

  /**
   * 删除
   */
  async deleteById(baseFindByIdDto: BaseFindByIdDto): Promise<void> {
    let { id } = baseFindByIdDto;

    await this.orgRepository.createQueryBuilder()
      .delete()
      .from(Org)
      .where('id = :id', { id: id })
      .execute();
  }
}
