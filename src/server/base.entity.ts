import {
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

// 状态类型
export enum statusType {
  ENABLE = 1,
  DISABLE = 0,
}

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


  @PrimaryGeneratedColumn('uuid', { comment: '主键 id' })
  id: string;

  @Column('tinyint', { comment: '状态（0：禁用；1：启用）', default: statusType.ENABLE })
  status: statusType;

  @Column('text', { comment: '描述', nullable: true })
  description: string;

  @CreateDateColumn({ comment: '创建时间', type: 'datetime', nullable: true })
  createTime: Date;

  @Column({ comment: '创建人 id', nullable: true })
  createBy: string;
  // @OneToOne(() => User)
  // @JoinColumn()
  // createBy: User;

  @UpdateDateColumn({ comment: '最后更新时间', type: 'datetime' , nullable: true})
  updateTime: Date;

  @Column({ comment: '修改人 id', nullable: true })
  updateBy: string;
  // @OneToOne(() => User)
  // @JoinColumn()
  // updateBy: User;
}
