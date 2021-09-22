import { AfterLoad, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';
import * as dayjs from 'dayjs';

@Entity('cms_article_link')
export class ArticleLink {
  @AfterLoad()
  updateDate() {
    if (this.createTime) {
      // @ts-ignore
      this.createTime = dayjs(this.createTime).format('YYYY-MM-DD hh:mm:ss');
    }
  }

  @PrimaryGeneratedColumn({ comment: '主键 id' })
  id: number;

  @Column('varchar', { comment: '用户 id', nullable: true })
  userId: string;

  @Column('varchar', { comment: '文章 id', nullable: true })
  articleId: string;

  @Column('tinyint', { comment: '是否收藏（0：否；1：是；）', nullable: true })
  status: number;

  @CreateDateColumn({ comment: '创建时间', type: 'datetime', nullable: true })
  createTime: Date;
}
