import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateArticleDataCatDto } from './dto/create-article-data-cat.dto';
import { UpdateArticleDataCatDto } from './dto/update-article-data-cat.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { ArticleDataCat } from './entities/article-data-cat.entity';
import { BaseFindByIdsDto } from '../base.dto';
import { Article } from '../article/entities/article.entity';
import { ApiException } from '../../common/exception/api-exception';
import { ApiErrorCode } from '../../constants/api-error-code.enum';

@Injectable()
export class ArticleDataCatService {
  private readonly logger = new Logger(ArticleDataCatService.name);

  constructor(
    @InjectRepository(ArticleDataCat)
    private readonly articleDataCatRepository: Repository<ArticleDataCat>,
  ) {
  }

  /**
   * 添加（批量）
   */
  async insertBatch(articleDataCat: ArticleDataCat[]): Promise<CreateArticleDataCatDto[] | ArticleDataCat[]> {
    return await this.articleDataCatRepository.save(articleDataCat);
  }

  /**
   * 获取（主键 id，批量）
   */
  async selectByIds(ids: string[]): Promise<ArticleDataCat[]> {
    return await this.articleDataCatRepository.find({
      relations: ['cat'],
      where: {
        id: In(ids),
      },
    });
  }

  /**
   * 获取详情（分类 id）
   */
  async selectByCatId(id: string): Promise<ArticleDataCat[]> {
    try {
      const ret = await this.articleDataCatRepository.find({
        where: {
          catId: id,
        },
      });
      return ret;
    } catch (e) {
      this.logger.error('系统异常：', e);
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  /**
   * 删除（文章 id）
   */
  async deleteByArticleId(id: string): Promise<any> {
    return await this.articleDataCatRepository
      .createQueryBuilder()
      .delete()
      .from(ArticleDataCat)
      .where('articleId = :articleId', { articleId: id })
      .execute();
  }

  /**
   * 删除（文章 id，批量）
   */
  async deleteByArticleIds(baseFindByIdsDto: BaseFindByIdsDto): Promise<any> {
    const { ids } = baseFindByIdsDto;
    return await this.articleDataCatRepository
      .createQueryBuilder()
      .delete()
      .from(ArticleDataCat)
      .where('articleId IN (:articleId)', { articleId: ids })
      .execute();
  }
}
