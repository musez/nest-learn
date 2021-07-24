import {
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { DeleteType, StatusType } from 'src/constants/dicts';

export abstract class BaseEntity {
  constructor() {
    this.id = undefined;
    this.status = undefined;
    this.description = undefined;
    this.createTime = undefined;
    this.createBy = undefined;
    this.updateTime = undefined;
    this.updateBy = undefined;
    this.deleteStatus = undefined;
    this.deleteTime = undefined;
    this.deleteBy = undefined;
  }

  @PrimaryGeneratedColumn('uuid', { comment: '主键 id' })
  id: string;

  @Column('tinyint', { comment: '状态（0：禁用；1：启用）', default: StatusType.ENABLE })
  status: StatusType;

  @Column('text', { comment: '描述', nullable: true })
  description: string;

  @CreateDateColumn({ comment: '创建时间', type: 'datetime', nullable: true })
  createTime: Date;

  @Column({ comment: '创建人 id', nullable: true })
  createBy: string;

  @UpdateDateColumn({ comment: '最后更新时间', type: 'datetime', nullable: true })
  updateTime: Date;

  @Column({ comment: '修改人 id', nullable: true })
  updateBy: string;

  @Column('tinyint', { comment: '删除状态（0：未删除；1：删除）', default: DeleteType.DEFAULT })
  deleteStatus: DeleteType;

  @DeleteDateColumn({ comment: '删除时间', type: 'datetime', nullable: true })
  deleteTime: Date;

  @Column({ comment: '删除人 id', nullable: true })
  deleteBy: string;
}
