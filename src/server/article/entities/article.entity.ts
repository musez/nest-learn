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

@Entity('article')
export class Article extends BaseEntity {
  @Column('varchar', { comment: '标题', length: 255 })
  title: string;

  @Column('varchar', { comment: '摘要', length: 255 })
  summary: string;

  @Column('varchar', { comment: '作者', length: 50 })
  author: string;

  @Column('varchar', { comment: '来源', length: 50 })
  source: string;

  @Column('varchar', { comment: '关键字（多个使用逗号“，”分隔）', length: 100 })
  keywords: string;

  @Column('tinyint', { comment: '媒体类型（1：文本；2：链接；3：图片；4：组图；5：视频；6：音频）', default: () => 0 })
  type: number;

  @Column('varchar', { comment: '缩略图', length: 255 })
  thumbUrl: string;

  @Column('varchar', { comment: '链接地址', length: 255 })
  contentUrl: string;

  @Column('varchar', { comment: '媒体地址', length: 255 })
  mediaUrl: string;

  @Column('int', { comment: '权重' })
  weight: number;

  @Column('text', { comment: '内容' })
  content: string;

  @Column('datetime', { comment: '发布时间' })
  publicTime: Date;

  @Column('int', { comment: '浏览量' })
  browseCount: number;

  @Column('int', { comment: '点赞量' })
  linkCount: number;

  @Column('int', { comment: '收藏量' })
  collectCount: number;

  @Column('int', { comment: '分享量' })
  shareCount: number;

  @Column('int', { comment: '评论量' })
  commentCount: number;
}
