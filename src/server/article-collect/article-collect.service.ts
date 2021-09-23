import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateArticleCollectDto } from './dto/create-article-collect.dto';
import { UpdateArticleCollectDto } from './dto/update-article-collect.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ArticleCollect } from './entities/article-collect.entity';
import { Utils } from '../../utils';
import { ApiException } from '../../common/exception/api-exception';
import { ApiErrorCode } from '../../constants/api-error-code.enum';
import { BaseModifyStatusByIdsDto } from '../base.dto';
import { ArticleLink } from '../article-link/entities/user-article-link.entity';

@Injectable()
export class ArticleCollectService {
  constructor(
    @InjectRepository(ArticleCollect)
    private readonly articleCollectRepository: Repository<ArticleCollect>,
  ) {
  }

  /**
   * 添加
   */
  async insert(createArticleCollectDto: CreateArticleCollectDto, curUser?): Promise<any> {
    try {
      let articleCollect = new ArticleCollect();
      articleCollect = Utils.dto2entity(createArticleCollectDto, articleCollect);
      if (curUser) {
        articleCollect.userId = curUser!.id;
      }

      const ret = await this.articleCollectRepository.save(articleCollect);
      if (!ret) {
        throw new ApiException('操作异常！', ApiErrorCode.ERROR, HttpStatus.OK);
      }
      return ret;
    } catch (e) {
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  /**
   * 获取列表
   */
  async selectList(): Promise<any[]> {
    try {
      const queryConditionList = [];
      queryConditionList.push('status = :status');
      const queryCondition = queryConditionList.join(' AND ');

      const ret = await this.articleCollectRepository
        .createQueryBuilder()
        .where(queryCondition, {
          status: 1,
        })
        .orderBy({
          status: 'DESC',
          createTime: 'DESC',
        })
        .getMany();

      return ret;
    } catch (e) {
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  /**
   * 是否存在（主键 id）
   */
  async isExistId(id: string): Promise<boolean> {
    try {
      const isExist = await this.articleCollectRepository.findOne(id);
      if (Utils.isNil(isExist)) {
        return false;
      } else {
        return true;
      }
    } catch (e) {
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  /**
   * 修改状态
   */
  async updateStatusByUserAndArticleId(obj): Promise<void> {
    try {
      const { articleId, userId, status } = obj;

      await this.articleCollectRepository
        .createQueryBuilder()
        .update(ArticleCollect)
        .set({
          status: status,
        })
        .where('articleId = :articleId AND userId = :userId', { articleId: articleId, userId: userId })
        .execute();
    } catch (e) {
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  /**
   * 修改状态
   */
  async updateStatus(baseModifyStatusByIdsDto: BaseModifyStatusByIdsDto, curUser?): Promise<void> {
    try {
      // eslint-disable-next-line prefer-const
      let { ids, status } = baseModifyStatusByIdsDto;
      if (!Utils.isArray(ids)) {
        ids = Utils.split(ids.toString());
      }

      await this.articleCollectRepository
        .createQueryBuilder()
        .update(ArticleCollect)
        .set({
          status: status,
        })
        .where('id IN (:ids)', { ids: ids })
        .execute();
    } catch (e) {
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }
}
