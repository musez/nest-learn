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
  OneToOne,
  BeforeUpdate,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { BaseEntity } from '../../base.entity';

@Entity('sys_post')
export class Post extends BaseEntity {
  constructor() {
    super();

    this.name = undefined;
    this.sort = undefined;
  }

  @Column('varchar', { comment: '岗位名称', length: 50 })
  name: string;

  @Column({ comment: '排序', default: () => 0 })
  sort: number;
}
