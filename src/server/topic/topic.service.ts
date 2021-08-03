import { Injectable } from '@nestjs/common';
import { CreateTopicDto } from './dto/create-topic.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Topic } from './entities/topic.entity';
import { Utils } from '../../utils';
import { BaseFindByIdDto, BaseFindByIdsDto } from '../base.dto';
import { LimitTopicDto } from './dto/limit-top.dto';
import { SearchTopicDto } from './dto/search-top.dto';
import { Org } from '../org/entities/org.entity';

@Injectable()
export class TopicService {
  constructor(
    @InjectRepository(Topic)
    private readonly topicRepository: Repository<Topic>,
  ) {
  }

  /**
   * 添加
   */
  async insert(createTopicDto: CreateTopicDto, curUser): Promise<CreateTopicDto> {
    return await this.topicRepository.save(createTopicDto);
  }

  /**
   * 获取列表
   */
  async selectList(searchTopicDto: SearchTopicDto): Promise<any[]> {
    const { content, topicType, status } = searchTopicDto;

    const queryConditionList = [];
    if (!Utils.isBlank(content)) {
      queryConditionList.push('content LIKE :content');
    }
    if (!Utils.isBlank(topicType)) {
      queryConditionList.push('topicType = :topicType');
    }
    if (!Utils.isBlank(status)) {
      queryConditionList.push('status = :status');
    }
    queryConditionList.push('deleteStatus = 0');
    const queryCondition = queryConditionList.join(' AND ');

    return await this.topicRepository.createQueryBuilder()
      .where(queryCondition, {
        content: `%${content}%`,
        topicType: topicType,
        status: status,
      })
      .orderBy({ 'createTime': 'DESC' })
      .getMany();
  }

  /**
   * 获取列表（分页）
   */
  async selectListPage(limitTopicDto: LimitTopicDto): Promise<any> {
    // eslint-disable-next-line prefer-const
    let { page, limit, content, topicType, status } = limitTopicDto;
    page = page ? Number(page) : 1;
    limit = limit ? Number(limit) : 10;
    const offset = (page - 1) * limit;

    const queryConditionList = [];
    if (!Utils.isBlank(content)) {
      queryConditionList.push('content LIKE :content');
    }
    if (!Utils.isBlank(topicType)) {
      queryConditionList.push('topicType = :topicType');
    }
    if (!Utils.isBlank(status)) {
      queryConditionList.push('status = :status');
    }
    queryConditionList.push('deleteStatus = 0');
    const queryCondition = queryConditionList.join(' AND ');

    const res = await this.topicRepository.createQueryBuilder()
      .where(queryCondition, {
        content: `%${content}%`,
        topicType: topicType,
        status: status,
      })
      .skip(offset)
      .take(limit)
      .orderBy({ 'createTime': 'DESC' })
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
  async selectById(baseFindByIdDto: BaseFindByIdDto): Promise<Topic> {
    const { id } = baseFindByIdDto;
    return await this.topicRepository.findOne(id);
  }

  /**
   * 是否存在（主键 id）
   */
  async isExistId(id: string): Promise<boolean> {
    const isExist = await this.topicRepository.findOne(id);
    if (Utils.isNil(isExist)) {
      return false;
    } else {
      return true;
    }
  }

  /**
   * 修改
   */
  async update(updateTopicDto: UpdateTopicDto, curUser): Promise<void> {
    const { id } = updateTopicDto;

    let article = new Topic();
    article = Utils.dto2entity(updateTopicDto, article);

    await this.topicRepository.update(id, article);
  }


  /**
   * 删除
   */
  async deleteById(baseFindByIdDto: BaseFindByIdDto, curUser): Promise<void> {
    const { id } = baseFindByIdDto;

    await this.topicRepository.createQueryBuilder()
      .update(Org)
      .set({ deleteStatus: 1, deleteBy: curUser!.id, deleteTime: Utils.now() })
      .where('id = :id', { id: id })
      .execute();
  }

  /**
   * 删除（批量）
   */
  async deleteByIds(baseFindByIdsDto: BaseFindByIdsDto, curUser): Promise<void> {
    const { ids } = baseFindByIdsDto;

    await this.topicRepository.createQueryBuilder()
      .update(Org)
      .set({ deleteStatus: 1, deleteBy: curUser!.id, deleteTime: Utils.now() })
      .where('id in (:ids)', { ids: ids })
      .execute();
  }
}
