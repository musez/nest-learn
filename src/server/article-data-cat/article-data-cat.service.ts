import { Injectable, Logger } from '@nestjs/common';
import { CreateArticleDataCatDto } from './dto/create-article-data-cat.dto';
import { UpdateArticleDataCatDto } from './dto/update-article-data-cat.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { ArticleDataCat } from './entities/article-data-cat.entity';

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
   * 获取分类（批量）
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
   * 删除
   */
  async deleteByArticleId(id: string): Promise<any> {
    return await this.articleDataCatRepository
      .createQueryBuilder()
      .delete()
      .from(ArticleDataCat)
      .where('articleId = :id', { id: id })
      .execute();
  }
}
