import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { SysPost } from './entities/post.entity';
import { Utils } from '../../utils';
import { LimitPostDto } from './dto/limit-post.dto';
import { BaseFindByIdDto, BaseFindByIdsDto, BaseModifyStatusByIdsDto } from '../base.dto';
import { ApiException } from '../../common/exception/api-exception';
import { ApiErrorCode } from '../../constants/api-error-code.enum';

@Injectable()
export class PostService {
  private readonly logger = new Logger(PostService.name);

  constructor(
    @InjectRepository(SysPost)
    private readonly postRepository: Repository<SysPost>,
  ) {
  }

  async insert(createPostDto: CreatePostDto, curUser?) {
    try {
      const { name } = createPostDto;

      const isExist = await this.postRepository.findOne({ name: name });
      if (isExist) {
        throw new ApiException(`岗位名称：${name} 已存在！`, ApiErrorCode.USER_NAME_EXISTS, HttpStatus.OK);
      }

      let post = new SysPost();
      post = Utils.dto2entity(createPostDto, post);
      if (curUser) {
        post.createBy = curUser!.id;
      }
      return await this.postRepository.save(post);
    } catch (e) {
      this.logger.error('系统异常：', e);
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  /**
   * 获取列表
   */
  async selectList(query): Promise<any[]> {
    try {
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
        queryConditionList.push('status IN (:status)');
      }
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
    } catch (e) {
      this.logger.error('系统异常：', e);
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  /**
   * 获取列表（分页）
   */
  async selectListPage(limitPostDto: LimitPostDto): Promise<any> {
    try {
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
          // @ts-ignore
          status = Utils.split(status.toString());
        }
        queryConditionList.push('status IN (:status)');
      }
      const queryCondition = queryConditionList.join(' AND ');

      const ret = await this.postRepository
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
        list: ret[0],
        total: ret[1],
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
  async selectById(baseFindByIdDto: BaseFindByIdDto): Promise<SysPost> {
    try {
      return await this.postRepository.findOne(baseFindByIdDto);
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
      const isExist = await this.postRepository.findOne(id);
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
  async update(updatePostDto: UpdatePostDto, curUser?): Promise<void> {
    try {
      const { id } = updatePostDto;
      const isExist = await this.postRepository.findOne(id);
      if (Utils.isNil(isExist)) {
        throw new ApiException(`数据 id：${id} 不存在！`, ApiErrorCode.NOT_FOUND, HttpStatus.OK);
      }

      let post = new SysPost();
      post = Utils.dto2entity(updatePostDto, post);
      if (curUser) {
        post.updateBy = curUser!.id;
      }

      await this.postRepository.update(id, post);
    } catch (e) {
      this.logger.error('系统异常：', e);
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  /**
   * 修改状态（批量，主键 ids）
   */
  async updateStatus(baseModifyStatusByIdsDto: BaseModifyStatusByIdsDto, curUser?): Promise<any> {
    try {
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
        throw new ApiException('更新异常！', ApiErrorCode.ERROR, HttpStatus.OK);
      }

      return ret;
    } catch (e) {
      this.logger.error('系统异常：', e);
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  /**
   * 删除（主键 id）
   */
  async deleteById(baseFindByIdDto: BaseFindByIdDto, curUser?): Promise<void> {
    try {
      const { id } = baseFindByIdDto;
      const isExist = await this.postRepository.findOne(id);
      if (Utils.isNil(isExist)) {
        throw new ApiException(`数据 id：${baseFindByIdDto} 不存在！`, ApiErrorCode.NOT_FOUND, HttpStatus.OK);
      }

      // await this.postRepository.delete(isExist);
      await this.postRepository
        .createQueryBuilder()
        .delete()
        .from(SysPost)
        .where('id = :id', { id: id })
        .execute();
    } catch (e) {
      this.logger.error('系统异常：', e);
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  /**
   * 删除（批量，主键 ids）
   */
  async deleteByIds(baseFindByIdsDto: BaseFindByIdsDto, curUser?): Promise<void> {
    try {
      let { ids } = baseFindByIdsDto;

      if (!Utils.isArray(ids)) {
        ids = Utils.split(ids.toString());
      }
      await this.postRepository
        .createQueryBuilder()
        .delete()
        .from(SysPost)
        .where('id IN (:ids)', { ids: ids })
        .execute();
    } catch (e) {
      this.logger.error('系统异常：', e);
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }
}
