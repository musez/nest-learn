import {
  Entity,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne, Column,
} from 'typeorm';
import { Article } from '../../article/entities/article.entity';
import { ArticleCat } from '../../article-cat/entities/article-cat.entity';

@Entity('cms_article_data_cat')
export class ArticleDataCat {
  @PrimaryGeneratedColumn('uuid', { comment: '主键 id' })
  id: string;

  @ManyToOne((type) => Article, (article) => article.articleDataCats)
  // @JoinColumn({ name: 'articleId' })
  @JoinColumn()
  article: Article;

  @Column('uuid', { comment: '文章 id', nullable: true })
  articleId: string;

  @ManyToOne((type) => ArticleCat, (cat) => cat.articleDataCats)
  // @JoinColumn({ name: 'catId' })
  @JoinColumn()
  cat: ArticleCat;

  @Column('uuid', { comment: '文章分类 id', nullable: true })
  catId: string;
}
