import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateTopicDto } from './dto/create-topic.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Topic } from './entities/topic.entity';
import { Utils } from '../../utils';
import { BaseFindByIdDto, BaseFindByIdsDto, BaseModifyStatusByIdsDto } from '../base.dto';
import { LimitTopicDto } from './dto/limit-top.dto';
import { SearchTopicDto } from './dto/search-top.dto';
import { Org } from '../org/entities/org.entity';
import { User } from '../user/entities/user.entity';
import { ApiException } from '../../common/exception/api-exception';
import { Comment } from '../comment/entities/comment.entity';
import { ApiErrorCode } from '../../constants/api-error-code.enum';

@Injectable()
export class TopicService {
  private readonly logger = new Logger(TopicService.name);

  constructor(
    @InjectRepository(Topic)
    private readonly topicRepository: Repository<Topic>,
  ) {
  }

  /**
   * 添加
   */
  async insert(createTopicDto: CreateTopicDto, curUser?): Promise<CreateTopicDto> {
    try {
      return await this.topicRepository.save(createTopicDto);
    } catch (e) {
      this.logger.error('系统异常：', e);
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  /**
   * 获取列表
   */
  async selectList(searchTopicDto: SearchTopicDto): Promise<any[]> {
    try {
      // eslint-disable-next-line prefer-const
      let { topicId, content, topicType, status, isReply } = searchTopicDto;

      const queryConditionList = [];
      if (!Utils.isBlank(topicId)) {
        queryConditionList.push('topic.topicId = :topicId');
      }
      if (!Utils.isBlank(content)) {
        queryConditionList.push('topic.content LIKE :content');
      }
      if (!Utils.isBlank(topicType)) {
        queryConditionList.push('topic.topicType = :topicType');
      }
      if (!Utils.isBlank(status)) {
        if (!Utils.isArray(status)) {
          // @ts-ignore
          status = Utils.split(status.toString());
        }
        queryConditionList.push('topic.status IN (:status)');
      }
      if (!Utils.isBlank(isReply)) {
        if (isReply === 0) {
          queryConditionList.push('commentId IS NOT NULL');
        } else if (isReply === 1) {
          queryConditionList.push('commentId IS NULL');
        }
      }
      const queryCondition = queryConditionList.join(' AND ');

      const ret = await this.topicRepository
        .createQueryBuilder('topic')
        .leftJoinAndSelect(User, 'u', 'u.id = topic.fromUid')
        .leftJoinAndSelect(Comment, 'c', 'c.replyId = topic.id')
        .select([
          'topic.*',
          'u.userName AS fromUname',
          'c.id AS commentId',
          'c.replyType AS replyType',
        ])
        .where(queryCondition, {
          topicId: topicId,
          content: `%${content}%`,
          topicType: topicType,
          status: status,
        })
        .orderBy({
          'topic.status': 'ASC',
          'topic.createTime': 'ASC',
        })
        .getRawMany();

      ret.forEach(i => {
        if (i.replyType === 0 && i.commentId) {
          i.isReply = 1;
        } else {
          i.isReply = 0;
        }
      });

      return ret;
    } catch (e) {
      this.logger.error('系统异常：', e);
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  /**
   * 获取列表（分页）
   */
  async selectListPage(limitTopicDto: LimitTopicDto): Promise<any> {
    try {
      // eslint-disable-next-line prefer-const
      let { page, limit, topicId, content, topicType, status, isReply } = limitTopicDto;
      page = page ? page : 1;
      limit = limit ? limit : 10;
      const offset = (page - 1) * limit;

      const queryConditionList = [];
      if (!Utils.isBlank(topicId)) {
        queryConditionList.push('topic.topicId = :topicId');
      }
      if (!Utils.isBlank(content)) {
        queryConditionList.push('topic.content LIKE :content');
      }
      if (!Utils.isBlank(topicType)) {
        queryConditionList.push('topic.topicType = :topicType');
      }
      if (!Utils.isBlank(status)) {
        if (!Utils.isArray(status)) {
          // @ts-ignore
          status = Utils.split(status.toString());
        }
        queryConditionList.push('topic.status IN (:status)');
      }
      if (!Utils.isBlank(isReply)) {
        if (isReply === 0) {
          queryConditionList.push('commentId IS NOT NULL');
        } else if (isReply === 1) {
          queryConditionList.push('commentId IS NULL');
        }
      }
      const queryCondition = queryConditionList.join(' AND ');

      const queryBuilder = this.topicRepository
        .createQueryBuilder('topic')
        .leftJoinAndSelect(User, 'u', 'u.id = topic.fromUid')
        .leftJoinAndSelect(Comment, 'c', 'c.replyId = topic.id')
        .select([
          'topic.*',
          'u.userName AS fromUname',
          'c.id AS commentId',
          'c.replyType AS replyType',
        ])
        .where(queryCondition, {
          topicId: topicId,
          content: `%${content}%`,
          topicType: topicType,
          status: status,
        });

      const ret = await queryBuilder
        // .skip(offset)
        // .take(limit)
        .offset(offset)
        .limit(limit)
        .orderBy({
          'topic.status': 'ASC',
          'topic.createTime': 'ASC',
        })
        .getRawMany();

      ret.forEach(i => {
        if (i.replyType === 0 && i.commentId) {
          i.isReply = 1;
        } else {
          i.isReply = 0;
        }
      });

      const retCount = await queryBuilder.getCount();

      return {
        list: ret,
        total: retCount,
        page: page,
        limit: limit,
      };
    } catch (e) {
      this.logger.error('系统异常：', e);
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  /**
   * 获取详情（主键 id）
   */
  async selectById(baseFindByIdDto: BaseFindByIdDto): Promise<Topic> {
    try {
      const { id } = baseFindByIdDto;
      return await this.topicRepository.findOne(id);
    } catch (e) {
      this.logger.error('系统异常：', e);
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  /**
   * 是否存在（主键 id）
   */
  async isExistId(id: string): Promise<boolean> {
    try {
      const isExist = await this.topicRepository.findOne(id);
      if (Utils.isNil(isExist)) {
        return false;
      } else {
        return true;
      }
    } catch (e) {
      this.logger.error('系统异常：', e);
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  /**
   * 修改
   */
  async update(updateTopicDto: UpdateTopicDto, curUser?): Promise<void> {
    try {
      const { id } = updateTopicDto;

      let article = new Topic();
      article = Utils.dto2entity(updateTopicDto, article);

      await this.topicRepository.update(id, article);
    } catch (e) {
      this.logger.error('系统异常：', e);
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  /**
   * 修改状态
   */
  async updateStatus(baseModifyStatusByIdsDto: BaseModifyStatusByIdsDto, curUser?): Promise<any> {
    try {
      // eslint-disable-next-line prefer-const
      let { ids, status } = baseModifyStatusByIdsDto;
      if (!Utils.isArray(ids)) {
        ids = Utils.split(ids.toString());
      }
      const ret = this.topicRepository
        .createQueryBuilder()
        .update(Topic)
        .set({ status: status, updateBy: curUser ? curUser!.id : null })
        .where('id IN (:ids)', { ids: ids })
        .execute();

      if (!ret) {
        throw new ApiException('更新异常！', ApiErrorCode.ERROR, HttpStatus.OK);
      }

      return ret;
    } catch (e) {
      this.logger.error('系统异常：', e);
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  /**
   * 删除
   */
  async deleteById(baseFindByIdDto: BaseFindByIdDto, curUser?): Promise<void> {
    try {
      const { id } = baseFindByIdDto;

      await this.topicRepository
        .createQueryBuilder()
        .delete()
        .from(Topic)
        .where('id = :id', { id: id })
        .execute();
    } catch (e) {
      this.logger.error('系统异常：', e);
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  /**
   * 删除（批量）
   */
  async deleteByIds(baseFindByIdsDto: BaseFindByIdsDto, curUser?): Promise<void> {
    try {
      let { ids } = baseFindByIdsDto;

      if (!Utils.isArray(ids)) {
        ids = Utils.split(ids.toString());
      }
      await this.topicRepository
        .createQueryBuilder()
        .delete()
        .from(Topic)
        .where('id IN (:ids)', { ids: ids })
        .execute();
    } catch (e) {
      this.logger.error('系统异常：', e);
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }
}
