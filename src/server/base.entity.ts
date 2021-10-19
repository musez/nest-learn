import {
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  AfterLoad,
} from 'typeorm';
import { StatusType } from '../constants/dicts.enum';
import * as dayjs from 'dayjs';

export abstract class BaseEntity {
  constructor() {
    this.id = undefined;
    this.status = undefined;
    this.description = undefined;
    this.createTime = undefined;
    this.createBy = undefined;
    this.updateTime = undefined;
    this.updateBy = undefined;
  }

  @AfterLoad()
  updateDate() {
    if (this.createTime) {
      // @ts-ignore
      this.createTime = dayjs(this.createTime).format('YYYY-MM-DD hh:mm:ss');
    }
    if (this.updateTime) {
      // @ts-ignore
      this.updateTime = dayjs(this.updateTime).format('YYYY-MM-DD hh:mm:ss');
    }
  }

  @PrimaryGeneratedColumn('uuid', { comment: '主键 id' })
  id: string;

  @Column('tinyint', {
    comment: '状态（0：禁用；1：启用）',
    default: StatusType.ENABLE,
  })
  status: StatusType;

  @Column('text', { comment: '描述', nullable: true })
  description: string;

  @CreateDateColumn({ comment: '创建时间', type: 'datetime', length: 0, nullable: true })
  createTime: Date;

  @Column({ comment: '创建人 id', nullable: true })
  createBy: string;

  @UpdateDateColumn({
    comment: '最后更新时间',
    type: 'datetime',
    length: 0,
    nullable: true,
  })
  updateTime: Date;

  @Column({ comment: '修改人 id', nullable: true })
  updateBy: string;
}
