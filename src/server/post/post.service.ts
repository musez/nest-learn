import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { SysPost } from './entities/post.entity';
import { Utils } from '../../utils';
import { LimitPostDto } from './dto/limit-post.dto';
import { BaseFindByIdDto, BaseFindByIdsDto } from '../base.dto';
import { ApiException } from 'src/common/exception/api-exception';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(SysPost)
    private readonly postRepository: Repository<SysPost>,
  ) {
  }

  async insert(createPostDto: CreatePostDto, curUser) {
    const { name } = createPostDto;

    const isExist = await this.postRepository.findOne({ name: name });
    if (isExist) {
      throw new ApiException(`岗位名称：${name} 已存在！`, 1009);
    }

    let post = new SysPost();
    post = Utils.dto2entity(createPostDto, post);
    post.createBy = curUser!.id;
    return await this.postRepository.save(post);
  }

  /**
   * 获取列表
   */
  async selectList(query): Promise<any[]> {
    const { name } = query;

    const queryConditionList = [];
    if (!Utils.isBlank(name)) {
      queryConditionList.push('name LIKE :name');
    }
    queryConditionList.push('deleteStatus = 0');
    const queryCondition = queryConditionList.join(' AND ');

    return await this.postRepository.createQueryBuilder()
      .where(queryCondition, {
        name: `%${name}%`,
      })
      .orderBy({
        'sort': 'ASC',
        'createTime': 'DESC',
      })
      .getMany();
  }

  /**
   * 获取列表（分页）
   */
  async selectListPage(limitPostDto: LimitPostDto): Promise<any> {
    let { page, limit, name } = limitPostDto;
    page = page ? page : 1;
    limit = limit ? limit : 10;
    const offset = (page - 1) * limit;

    const queryConditionList = [];
    if (!Utils.isBlank(name)) {
      queryConditionList.push('name LIKE :name');
    }
    queryConditionList.push('deleteStatus = 0');
    const queryCondition = queryConditionList.join(' AND ');

    const res = await this.postRepository.createQueryBuilder()
      .where(queryCondition, {
        name: `%${name}%`,
      })
      .skip(offset)
      .take(limit)
      .orderBy({
        'sort': 'ASC',
        'createTime': 'DESC',
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
  async update(updatePostDto: UpdatePostDto, curUser): Promise<void> {
    const { id } = updatePostDto;
    const isExist = await this.postRepository.findOne(id);
    if (Utils.isNil(isExist)) {
      throw new ApiException(`数据 id：${id} 不存在！`, 404);
    }

    let post = new SysPost();
    post = Utils.dto2entity(updatePostDto, post);
    post.updateBy = curUser!.id;

    await this.postRepository.update(id, post);
  }

  /**
   * 删除
   */
  async deleteById(baseFindByIdDto: BaseFindByIdDto, curUser): Promise<void> {
    const { id } = baseFindByIdDto;
    const isExist = await this.postRepository.findOne(id);
    if (Utils.isNil(isExist)) {
      throw new ApiException(`数据 id：${baseFindByIdDto} 不存在！`, 404);
    }

    // await this.postRepository.delete(isExist);
    await this.postRepository.createQueryBuilder()
      .update(SysPost)
      .set({ deleteStatus: 1, deleteBy: curUser!.id, deleteTime: Utils.now() })
      .where('id = :id', { id: id })
      .execute();
  }

  /**
   * 删除（批量）
   */
  async deleteByIds(baseFindByIdsDto: BaseFindByIdsDto, curUser): Promise<void> {
    const { ids } = baseFindByIdsDto;

    await this.postRepository.createQueryBuilder()
      .update(SysPost)
      .set({ deleteStatus: 1, deleteBy: curUser!.id, deleteTime: Utils.now() })
      .where('id in (:ids)', { ids: ids })
      .execute();
  }
}
