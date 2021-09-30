import {
  Entity,
  Column,
  OneToMany,
  AfterLoad, VersionColumn,
} from 'typeorm';
import { BaseEntity } from '../../base.entity';
import {
  ArticleType,
  IsCommentType,
  StatusType,
} from '../../../constants/dicts.enum';
import { ArticleDataCat } from '../../article-data-cat/entities/article-data-cat.entity';
import * as dayjs from 'dayjs';

@Entity('cms_article')
export class Article extends BaseEntity {
  constructor() {
    super();

    this.title = undefined;
    this.summary = undefined;
    this.author = undefined;
    this.source = undefined;
    this.keywords = undefined;
    this.type = undefined;
    this.thumbId = undefined;
    this.fileId = undefined;
    this.contentUrl = undefined;
    this.mediaId = undefined;
    this.weight = undefined;
    this.content = undefined;
    this.publishTime = undefined;
    this.publishBy = undefined;
    this.browseCount = undefined;
    this.linkCount = undefined;
    this.collectCount = undefined;
    this.shareCount = undefined;
    this.isComment = undefined;
    this.commentCount = undefined;
    this.status = undefined;
  }

  @AfterLoad()
  updateDate() {
    if (this.publishTime) {
      // @ts-ignore
      this.publishTime = dayjs(this.publishTime).format('YYYY-MM-DD hh:mm:ss');
    }
  }

  @Column('varchar', { comment: '标题', length: 255 })
  title: string;

  @Column('varchar', { comment: '摘要', length: 255, nullable: true })
  summary: string;

  @Column('varchar', { comment: '作者', length: 50, nullable: true })
  author: string;

  @Column('varchar', { comment: '来源', length: 50, nullable: true })
  source: string;

  @Column('varchar', {
    comment: '关键字（多个使用逗号“，”分隔）',
    length: 100,
    nullable: true,
  })
  keywords: string;

  @Column('tinyint', {
    comment: '文章类型（0：文本；1：链接；2：图片；3：组图；4：视频；5：音频）',
  })
  type: ArticleType;

  @Column('varchar', { comment: '缩略图', length: 255, nullable: true })
  thumbId: string;

  @Column('varchar', { comment: '附件', length: 255, nullable: true })
  fileId: string;

  @Column('varchar', { comment: '链接地址', length: 255, nullable: true })
  contentUrl: string;

  @Column('varchar', { comment: '媒体地址', length: 255, nullable: true })
  mediaId: string;

  @Column('int', { comment: '权重', nullable: true })
  weight: number;

  @Column('text', { comment: '内容', nullable: true })
  content: string;

  @Column('datetime', { comment: '发布时间', nullable: true })
  publishTime: Date;

  @Column({ comment: '发布人 id', nullable: true })
  publishBy: string;

  @Column('int', { comment: '浏览量', default: () => 0 })
  browseCount: number;

  @Column('int', { comment: '点赞量', default: () => 0 })
  linkCount: number;

  @Column('int', { comment: '收藏量', default: () => 0 })
  collectCount: number;

  @Column('int', { comment: '分享量', default: () => 0 })
  shareCount: number;

  @Column('tinyint', {
    comment: '允许评论（0：禁用；1：启用）',
    default: IsCommentType.ENABLE,
  })
  isComment: IsCommentType;

  @Column('int', { comment: '评论量', default: () => 0 })
  commentCount: number;

  @Column('tinyint', {
    comment: '状态（0：未发布；1：发布；2：草稿；3：回收站）',
    default: StatusType.DRAFT,
  })
  status: StatusType;

  @VersionColumn({ comment: '版本', nullable: true })
  version: string;

  @OneToMany(
    (type) => ArticleDataCat,
    (articleDataCat) => articleDataCat.article,
  )
  articleDataCats: ArticleDataCat[];
}
