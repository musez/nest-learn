import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { SysPost } from './entities/post.entity';
import { Utils } from '../../utils';
import { LimitPostDto } from './dto/limit-post.dto';
import { BaseFindByIdDto, BaseFindByIdsDto, BaseModifyStatusByIdsDto } from '../base.dto';
import { ApiException } from '../../common/exception/api-exception';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(SysPost)
    private readonly postRepository: Repository<SysPost>,
  ) {
  }

  async insert(createPostDto: CreatePostDto, curUser?) {
    const { name } = createPostDto;

    const isExist = await this.postRepository.findOne({ name: name });
    if (isExist) {
      throw new ApiException(`岗位名称：${name} 已存在！`, 1009, 200);
    }

    let post = new SysPost();
    post = Utils.dto2entity(createPostDto, post);
    if (curUser) {
      post.createBy = curUser!.id;
    }
    return await this.postRepository.save(post);
  }

  /**
   * 获取列表
   */
  async selectList(query): Promise<any[]> {
    // eslint-disable-next-line prefer-const
    let { name, status } = query;

    const queryConditionList = [];
    if (!Utils.isBlank(name)) {
      queryConditionList.push('name LIKE :name');
    }
    if (!Utils.isBlank(status)) {
      if (!Utils.isArray(status)) {
        status = Utils.split(status.toString());
      }
      queryConditionList.push('status IN (:...status)');
    }
    queryConditionList.push('deleteStatus = 0');
    const queryCondition = queryConditionList.join(' AND ');

    return await this.postRepository
      .createQueryBuilder()
      .where(queryCondition, {
        name: `%${name}%`,
        status: status,
      })
      .orderBy({
        status: 'DESC',
        sort: 'ASC',
        createTime: 'DESC',
      })
      .getMany();
  }

  /**
   * 获取列表（分页）
   */
  async selectListPage(limitPostDto: LimitPostDto): Promise<any> {
    // eslint-disable-next-line prefer-const
    let { page, limit, name, status } = limitPostDto;
    page = page ? page : 1;
    limit = limit ? limit : 10;
    const offset = (page - 1) * limit;

    const queryConditionList = [];
    if (!Utils.isBlank(name)) {
      queryConditionList.push('name LIKE :name');
    }
    if (!Utils.isBlank(status)) {
      if (!Utils.isArray(status)) {
        status = Utils.split(status.toString());
      }
      queryConditionList.push('status IN (:...status)');
    }
    queryConditionList.push('deleteStatus = 0');
    const queryCondition = queryConditionList.join(' AND ');

    const res = await this.postRepository
      .createQueryBuilder()
      .where(queryCondition, {
        name: `%${name}%`,
        status: status,
      })
      .skip(offset)
      .take(limit)
      .orderBy({
        status: 'DESC',
        sort: 'ASC',
        createTime: 'DESC',
      })
      .getManyAndCount();

    return {
      list: res[0],
      total: res[1],
      page: page,
      limit: limit,
    };
  }

  /**
   * 获取详情（主键 id）
   */
  async selectById(baseFindByIdDto: BaseFindByIdDto): Promise<SysPost> {
    return await this.postRepository.findOne(baseFindByIdDto);
  }

  /**
   * 是否存在（主键 id）
   */
  async isExistId(id: string): Promise<boolean> {
    const isExist = await this.postRepository.findOne(id);
    if (Utils.isNil(isExist)) {
      return false;
    } else {
      return true;
    }
  }

  /**
   * 修改
   */
  async update(updatePostDto: UpdatePostDto, curUser?): Promise<void> {
    const { id } = updatePostDto;
    const isExist = await this.postRepository.findOne(id);
    if (Utils.isNil(isExist)) {
      throw new ApiException(`数据 id：${id} 不存在！`, 404, 200);
    }

    let post = new SysPost();
    post = Utils.dto2entity(updatePostDto, post);
    if (curUser) {
      post.updateBy = curUser!.id;
    }

    await this.postRepository.update(id, post);
  }

  /**
   * 修改状态
   */
  async updateStatus(baseModifyStatusByIdsDto: BaseModifyStatusByIdsDto, curUser?): Promise<any> {
    // eslint-disable-next-line prefer-const
    let { ids, status } = baseModifyStatusByIdsDto;
    if (!Utils.isArray(ids)) {
      ids = Utils.split(ids.toString());
    }
    const ret = this.postRepository
      .createQueryBuilder()
      .update(SysPost)
      .set({ status: status, updateBy: curUser ? curUser!.id : null })
      .where('id IN (:ids)', { ids: ids })
      .execute();

    if (!ret) {
      throw new ApiException('更新异常！', 500, 200);
    }

    return ret;
  }

  /**
   * 删除
   */
  async deleteById(baseFindByIdDto: BaseFindByIdDto, curUser?): Promise<void> {
    const { id } = baseFindByIdDto;
    const isExist = await this.postRepository.findOne(id);
    if (Utils.isNil(isExist)) {
      throw new ApiException(`数据 id：${baseFindByIdDto} 不存在！`, 404, 200);
    }

    // await this.postRepository.delete(isExist);
    await this.postRepository
      .createQueryBuilder()
      .update(SysPost)
      .set({ deleteStatus: 1, deleteBy: curUser ? curUser!.id : null, deleteTime: Utils.now() })
      .where('id = :id', { id: id })
      .execute();
  }

  /**
   * 删除（批量）
   */
  async deleteByIds(baseFindByIdsDto: BaseFindByIdsDto, curUser?): Promise<void> {
    let { ids } = baseFindByIdsDto;

    if (!Utils.isArray(ids)) {
      ids = Utils.split(ids.toString());
    }
    await this.postRepository
      .createQueryBuilder()
      .update(SysPost)
      .set({ deleteStatus: 1, deleteBy: curUser ? curUser!.id : null, deleteTime: Utils.now() })
      .where('id IN (:ids)', { ids: ids })
      .execute();
  }
}
