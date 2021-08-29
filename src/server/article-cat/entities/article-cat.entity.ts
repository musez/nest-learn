import {
  Entity,
  Column,
  OneToMany,
} from 'typeorm';
import { BaseEntity } from '../../base.entity';
import { ArticleDataCat } from '../../article-data-cat/entities/article-data-cat.entity';

@Entity('cms_article_cat')
export class ArticleCat extends BaseEntity {
  constructor() {
    super();

    this.parentId = undefined;
    this.catName = undefined;
  }

  @Column({ comment: '父 id', nullable: true })
  parentId: string;

  @Column('varchar', { comment: '栏目名称', length: 255 })
  catName: string;

  @OneToMany((type) => ArticleDataCat, (articleDataCat) => articleDataCat.cat)
  articleDataCats: ArticleDataCat[];
}
