import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { SearchFeedbackDto } from './dto/search-feedback.dto';
import { LimitFeedbackDto } from './dto/limit-feedback.dto';
import { Utils } from '../../utils';
import { ApiException } from '../../common/exception/api-exception';
import { BaseFindByIdDto, BaseFindByIdsDto, BaseModifyStatusByIdsDto } from '../base.dto';
import { Feedback } from './entities/feedback.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectRepository(Feedback)
    private readonly feedbackRepository: Repository<Feedback>,
  ) {
  }

  /**
   * 添加
   */
  async insert(createFeedbackDto: CreateFeedbackDto, curUser?): Promise<CreateFeedbackDto | void> {
    const ret = await this.feedbackRepository.save(createFeedbackDto);

    if (ret) {
      return ret;
    } else {
      throw new ApiException('保存异常！', 500);
    }
  }

  /**
   * 获取列表
   */
  async selectList(searchFeedbackDto: SearchFeedbackDto): Promise<any[]> {
    // eslint-disable-next-line prefer-const
    let { feedbackType, businessType, name, mobile, email, status } = searchFeedbackDto;

    const queryConditionList = [];
    if (!Utils.isBlank(name)) {
      queryConditionList.push('name LIKE :name');
    }
    if (!Utils.isBlank(mobile)) {
      queryConditionList.push('mobile LIKE :mobile');
    }
    if (!Utils.isBlank(email)) {
      queryConditionList.push('email LIKE :email');
    }
    if (!Utils.isBlank(feedbackType)) {
      queryConditionList.push('feedbackType = :feedbackType');
    }
    if (!Utils.isBlank(businessType)) {
      queryConditionList.push('businessType = :businessType');
    }
    if (!Utils.isBlank(status)) {
      if (!Utils.isArray(status)) {
        status = Utils.split(status.toString());
      }
      queryConditionList.push('status IN (:...status)');
    }
    queryConditionList.push('deleteStatus = 0');
    const queryCondition = queryConditionList.join(' AND ');

    const ret = await this.feedbackRepository
      .createQueryBuilder()
      .where(queryCondition, {
        name: `%${name}%`,
        mobile: `%${mobile}%`,
        email: `%${email}%`,
        feedbackType: feedbackType,
        businessType: businessType,
        status: status,
      })
      .orderBy({
        'status': 'DESC',
        'createTime': 'DESC',
      })
      .getRawMany();

    if (!ret) {
      throw new ApiException('查询异常！', 500);
    }

    return ret;
  }

  /**
   * 获取列表（分页）
   */
  async selectListPage(limitFeedbackDto: LimitFeedbackDto): Promise<any> {
    // eslint-disable-next-line prefer-const
    let { page, limit, feedbackType, businessType, name, mobile, email, status } = limitFeedbackDto;
    page = page ? page : 1;
    limit = limit ? limit : 10;
    const offset = (page - 1) * limit;

    const queryConditionList = [];
    if (!Utils.isBlank(name)) {
      queryConditionList.push('name LIKE :name');
    }
    if (!Utils.isBlank(mobile)) {
      queryConditionList.push('mobile LIKE :mobile');
    }
    if (!Utils.isBlank(email)) {
      queryConditionList.push('email LIKE :email');
    }
    if (!Utils.isBlank(feedbackType)) {
      queryConditionList.push('feedbackType = :feedbackType');
    }
    if (!Utils.isBlank(businessType)) {
      queryConditionList.push('businessType = :businessType');
    }
    if (!Utils.isBlank(status)) {
      if (!Utils.isArray(status)) {
        status = Utils.split(status.toString());
      }
      queryConditionList.push('status IN (:...status)');
    }
    queryConditionList.push('deleteStatus = 0');
    const queryCondition = queryConditionList.join(' AND ');

    const queryBuilder = this.feedbackRepository
      .createQueryBuilder()
      .where(queryCondition, {
        name: `%${name}%`,
        mobile: `%${mobile}%`,
        email: `%${email}%`,
        feedbackType: feedbackType,
        businessType: businessType,
        status: status,
      });

    const ret = await queryBuilder
      // .skip(offset)
      // .take(limit)
      .offset(offset)
      .limit(limit)
      .orderBy({
        'status': 'DESC',
        'createTime': 'DESC',
      })
      .getRawMany();

    const retCount = await queryBuilder.getCount();

    if (!ret) {
      throw new ApiException('查询异常！', 500);
    }

    return {
      list: ret,
      total: retCount,
      page: page,
      limit: limit,
    };
  }

  /**
   * 获取详情（主键 id）
   */
  async selectById(baseFindByIdDto: BaseFindByIdDto): Promise<Feedback> {
    const { id } = baseFindByIdDto;

    const ret = await this.feedbackRepository.findOne({
      where: {
        id: id,
      },
    });
    if (!ret) {
      throw new ApiException(`数据 id：${id} 不存在！`, 404);
    }
    return ret;
  }

  /**
   * 是否存在（主键 id）
   */
  async isExistId(id: string): Promise<boolean> {
    const isExist = await this.feedbackRepository.findOne(id);
    if (Utils.isNil(isExist)) {
      return false;
    } else {
      return true;
    }
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
    const ret = this.feedbackRepository
      .createQueryBuilder()
      .update(Feedback)
      .set({ status: status, updateBy: curUser ? curUser!.id : null })
      .where('id IN (:ids)', { ids: ids })
      .execute();

    if (!ret) {
      throw new ApiException('更新异常！', 500);
    }

    return ret;
  }

  /**
   * 删除
   */
  async deleteById(baseFindByIdDto: BaseFindByIdDto, curUser?): Promise<void> {
    const { id } = baseFindByIdDto;

    const ret = await this.feedbackRepository
      .createQueryBuilder()
      .update(Feedback)
      .set({ deleteStatus: 1, deleteBy: curUser ? curUser!.id : null, deleteTime: Utils.now() })
      .where('id = :id', { id: id })
      .execute();

    if (!ret) {
      throw new ApiException('删除异常！', 500);
    }

    return null;
  }

  /**
   * 删除（批量）
   */
  async deleteByIds(baseFindByIdsDto: BaseFindByIdsDto, curUser?): Promise<void> {
    let { ids } = baseFindByIdsDto;

    if (!Utils.isArray(ids)) {
      ids = Utils.split(ids.toString());
    }
    const ret = await this.feedbackRepository
      .createQueryBuilder()
      .update(Feedback)
      .set({ deleteStatus: 1, deleteBy: curUser ? curUser!.id : null, deleteTime: Utils.now() })
      .where('id IN (:ids)', { ids: ids })
      .execute();

    if (!ret) {
      throw new ApiException('删除异常！', 500);
    }

    return null;
  }

}
