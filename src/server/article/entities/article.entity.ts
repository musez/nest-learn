import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  JoinTable,
  JoinColumn,
  ManyToMany,
  OneToMany,
  ManyToOne,
  BeforeUpdate,
} from 'typeorm';
import { BaseEntity } from '../../base.entity';
import { Group } from '../../group/entities/group.entity';
import { Role } from '../../role/entities/role.entity';
import { ArticleCat } from '../../article-cat/entities/article-cat.entity';

// 媒体类型
export enum ArticleType {
  TEXT = 0,
  LINK = 1,
  PICTURE = 2,
  PICTURE_GROUP = 3,
  VIDEO = 4,
  AUDIO = 5,
}

@Entity('article')
export class Article extends BaseEntity {
  constructor() {
    super();

    this.title = undefined;
    this.summary = undefined;
    this.author = undefined;
    this.source = undefined;
    this.keywords = undefined;
    this.type = undefined;
    this.thumbUrl = undefined;
    this.contentUrl = undefined;
    this.mediaUrl = undefined;
    this.weight = undefined;
    this.content = undefined;
    this.publicTime = undefined;
    this.browseCount = undefined;
    this.linkCount = undefined;
    this.collectCount = undefined;
    this.shareCount = undefined;
    this.commentCount = undefined;
  }

  @Column('varchar', { comment: '标题', length: 255 })
  title: string;

  @Column('varchar', { comment: '摘要', length: 255, nullable: true })
  summary: string;

  @Column('varchar', { comment: '作者', length: 50, nullable: true })
  author: string;

  @Column('varchar', { comment: '来源', length: 50, nullable: true })
  source: string;

  @Column('varchar', { comment: '关键字（多个使用逗号“，”分隔）', length: 100, nullable: true })
  keywords: string;

  @Column('tinyint', { comment: '媒体类型（1：文本；2：链接；3：图片；4：组图；5：视频；6：音频）' })
  type: ArticleType;

  @Column('varchar', { comment: '缩略图', length: 255, nullable: true })
  thumbUrl: string;

  @Column('varchar', { comment: '链接地址', length: 255, nullable: true })
  contentUrl: string;

  @Column('varchar', { comment: '媒体地址', length: 255, nullable: true })
  mediaUrl: string;

  @Column('int', { comment: '权重', nullable: true })
  weight: number;

  @Column('text', { comment: '内容', nullable: true })
  content: string;

  @Column('datetime', { comment: '发布时间', nullable: true })
  publicTime: Date;

  @Column('int', { comment: '浏览量', default: () => 0 })
  browseCount: number;

  @Column('int', { comment: '点赞量', default: () => 0 })
  linkCount: number;

  @Column('int', { comment: '收藏量', default: () => 0 })
  collectCount: number;

  @Column('int', { comment: '分享量', default: () => 0 })
  shareCount: number;

  @Column('int', { comment: '评论量', default: () => 0 })
  commentCount: number;

  @OneToMany(type => ArticleCat, cat => cat.articles)
  cats: ArticleCat[];
}
