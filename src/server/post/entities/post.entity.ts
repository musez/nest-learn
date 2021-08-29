import {
  Entity,
  Column,
} from 'typeorm';
import { BaseEntity } from '../../base.entity';

@Entity('sys_post')
export class SysPost extends BaseEntity {
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
