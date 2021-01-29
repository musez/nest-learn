import { Entity, PrimaryGeneratedColumn, JoinColumn, ManyToOne, Column } from 'typeorm';
import { Article } from '../../article/entities/article.entity';
import { ArticleCat } from '../../article-cat/entities/article-cat.entity';

@Entity('article_data_cat')
export class ArticleDataCat {
  @PrimaryGeneratedColumn('uuid', { comment: '主键 id' })
  id: string;

  @Column({ comment: '用户组 id' })
  articleId!: string;

  @Column({ comment: '角色 id' })
  catId!: string;

  @ManyToOne(type => Article, article => article.cats)
  @JoinColumn({ name: 'articleId' })
  articles: Article;

  @ManyToOne(type => ArticleCat, cat => cat.articles)
  @JoinColumn({ name: 'catId' })
  cats: ArticleCat;
}
