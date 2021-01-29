import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  JoinTable,
  ManyToMany,
  OneToMany,
  BeforeUpdate,
} from 'typeorm';
import { BaseEntity } from '../../base.entity';
import { Article } from '../../article/entities/article.entity';

@Entity('article_cat')
export class ArticleCat extends BaseEntity {
  constructor() {
    super();
    this.catName = undefined;
    this.parentId = undefined;
  }

  @Column('varchar', { comment: '栏目名称', length: 255 })
  catName: string;

  @Column({ comment: '父 id' })
  parentId: string;

  @OneToMany(type => Article, article => article.cats)
  articles: Article[];
}
