import { Injectable } from '@nestjs/common';
import { CreateArticleDataCatDto } from './dto/create-article-data-cat.dto';
import { UpdateArticleDataCatDto } from './dto/update-article-data-cat.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { ArticleDataCat } from './entities/article-data-cat.entity';
import { BaseFindByIdDto, BaseFindByIdsDto } from '../base.dto';

@Injectable()
export class ArticleDataCatService {
  constructor(
    @InjectRepository(ArticleDataCat)
    private readonly articleDataCatRepository: Repository<ArticleDataCat>,
  ) {}

  /**
   * 添加（批量）
   */
  async insertBatch(
    dto: ArticleDataCat[],
  ): Promise<CreateArticleDataCatDto[] | ArticleDataCat[]> {
    return await this.articleDataCatRepository.save(dto);
  }

  /**
   * 获取分类（批量）
   */
  async selectByArticleDataCatIds(
    dto: BaseFindByIdsDto,
  ): Promise<ArticleDataCat[]> {
    const { ids } = dto;
    return await this.articleDataCatRepository.find({
      relations: ['cat'],
      where: {
        id: In(ids.split(',')),
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
