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
  Tree,
  TreeChildren,
  TreeParent,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Staff } from '../staff/entities/staff.entity';

export abstract class BaseEntity {
  @PrimaryGeneratedColumn('uuid', {
    comment: '主键 id',
  })
  id: string;

  @Column('tinyint', {
    comment: '状态（0：禁用；1：启用）',
    default: () => 0,
  })
  status: number;

  @Column('text', {
    comment: '描述',
    nullable: true,
  })
  description: string;

  @CreateDateColumn({
    comment: '创建时间',
    type: 'datetime',
  })
  createTime: Date;

  @Column({
    comment: '创建人 id',
    nullable: true,
  })
  createBy: string;
  // @OneToOne(() => Staff)
  // @JoinColumn()
  // createBy: Staff;

  @UpdateDateColumn({
    comment: '修改时间',
    type: 'datetime',
  })
  updateTime: Date;

  @Column({
    comment: '修改人 id',
    nullable: true,
  })
  updateBy: string;
  // @OneToOne(() => Staff)
  // @JoinColumn()
  // updateBy: Staff;
}
