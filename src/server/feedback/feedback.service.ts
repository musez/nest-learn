import { HttpStatus, Injectable } from '@nestjs/common';
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
import { ApiErrorCode } from '../../constants/api-error-code.enum';

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
    try {
      const ret = await this.feedbackRepository.save(createFeedbackDto);

      if (ret) {
        return ret;
      } else {
        throw new ApiException('保存异常！', ApiErrorCode.ERROR, HttpStatus.OK);
      }
    } catch (e) {
      throw new ApiException(e.errorMessage, ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  /**
   * 获取列表
   */
  async selectList(searchFeedbackDto: SearchFeedbackDto): Promise<any[]> {
    try {
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
          'status': 'ASC',
          'createTime': 'DESC',
        })
        .getMany();

      if (!ret) {
        throw new ApiException('查询异常！', ApiErrorCode.ERROR, HttpStatus.OK);
      }

      return ret;
    } catch (e) {
      throw new ApiException(e.errorMessage, ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  /**
   * 获取列表（分页）
   */
  async selectListPage(limitFeedbackDto: LimitFeedbackDto): Promise<any> {
    try {
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
        .skip(offset)
        .take(limit)
        .orderBy({
          'status': 'ASC',
          'createTime': 'DESC',
        })
        .getManyAndCount();
      ;

      if (!ret) {
        throw new ApiException('查询异常！', ApiErrorCode.ERROR, HttpStatus.OK);
      }

      return {
        list: ret[0],
        total: ret[1],
        page: page,
        limit: limit,
      };
    } catch (e) {
      throw new ApiException(e.errorMessage, ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  /**
   * 获取详情（主键 id）
   */
  async selectById(baseFindByIdDto: BaseFindByIdDto): Promise<Feedback> {
    try {
      const { id } = baseFindByIdDto;

      const ret = await this.feedbackRepository.findOne({
        where: {
          id: id,
        },
      });
      if (!ret) {
        throw new ApiException(`数据 id：${id} 不存在！`, ApiErrorCode.NOT_FOUND, HttpStatus.OK);
      }
      return ret;
    } catch (e) {
      throw new ApiException(e.errorMessage, ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  /**
   * 是否存在（主键 id）
   */
  async isExistId(id: string): Promise<boolean> {
    try {
      const isExist = await this.feedbackRepository.findOne(id);
      if (Utils.isNil(isExist)) {
        return false;
      } else {
        return true;
      }
    } catch (e) {
      throw new ApiException(e.errorMessage, ApiErrorCode.ERROR, HttpStatus.OK);
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
      const ret = this.feedbackRepository
        .createQueryBuilder()
        .update(Feedback)
        .set({ status: status, updateBy: curUser ? curUser!.id : null })
        .where('id IN (:ids)', { ids: ids })
        .execute();

      if (!ret) {
        throw new ApiException('更新异常！', ApiErrorCode.ERROR, HttpStatus.OK);
      }

      return ret;
    } catch (e) {
      throw new ApiException(e.errorMessage, ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  /**
   * 删除
   */
  async deleteById(baseFindByIdDto: BaseFindByIdDto, curUser?): Promise<void> {
    try {
      const { id } = baseFindByIdDto;

      const ret = await this.feedbackRepository
        .createQueryBuilder()
        .update(Feedback)
        .set({ deleteStatus: 1, deleteBy: curUser ? curUser!.id : null, deleteTime: Utils.now() })
        .where('id = :id', { id: id })
        .execute();

      if (!ret) {
        throw new ApiException('删除异常！', ApiErrorCode.ERROR, HttpStatus.OK);
      }

      return null;
    } catch (e) {
      throw new ApiException(e.errorMessage, ApiErrorCode.ERROR, HttpStatus.OK);
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
      const ret = await this.feedbackRepository
        .createQueryBuilder()
        .update(Feedback)
        .set({ deleteStatus: 1, deleteBy: curUser ? curUser!.id : null, deleteTime: Utils.now() })
        .where('id IN (:ids)', { ids: ids })
        .execute();

      if (!ret) {
        throw new ApiException('删除异常！', ApiErrorCode.ERROR, HttpStatus.OK);
      }

      return null;
    } catch (e) {
      throw new ApiException(e.errorMessage, ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }
}
