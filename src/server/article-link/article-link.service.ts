import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateArticleLinkDto } from './dto/create-article-link.dto';
import { UpdateArticleLinkDto } from './dto/update-article-link.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Utils } from '../../utils';
import { ApiException } from '../../common/exception/api-exception';
import { ApiErrorCode } from '../../constants/api-error-code.enum';
import { BaseModifyStatusByIdsDto } from '../base.dto';
import { ArticleLink } from './entities/user-article-link.entity';

@Injectable()
export class ArticleLinkService {
  constructor(
    @InjectRepository(ArticleLink)
    private readonly articleLinkRepository: Repository<ArticleLink>,
  ) {
  }

  /**
   * 添加
   */
  async insert(createArticleLinkDto: CreateArticleLinkDto, curUser?): Promise<any> {
    try {
      let articleLink = new ArticleLink();
      articleLink = Utils.dto2entity(createArticleLinkDto, articleLink);

      if (curUser) {
        articleLink.userId = curUser!.id;
      }

      const ret = await this.articleLinkRepository.save(articleLink);
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

      const ret = await this.articleLinkRepository
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
      console.log(e);
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  /**
   * 是否存在（主键 id）
   */
  async isExistId(id: string): Promise<boolean> {
    try {
      const isExist = await this.articleLinkRepository.findOne(id);
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
   * 获取详情（用户 id & 文章 id）
   */
  async selectByUserAndArticleId(userId: string, articleId: string): Promise<boolean> {
    try {
      const isExist = await this.articleLinkRepository.findOne({
        where: {
          userId: userId,
          articleId: articleId,
        },
      });
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

      await this.articleLinkRepository
        .createQueryBuilder()
        .update(ArticleLink)
        .set({
          status: status,
        })
        .where('articleId = :articleId AND userId = :userId', { articleId: articleId, userId: userId })
        .execute();
    } catch (e) {
      console.log(e);
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

      await this.articleLinkRepository
        .createQueryBuilder()
        .update(ArticleLink)
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
