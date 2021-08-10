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
import { OrgType } from '../../../constants/dicts.enum';

@Entity('sys_org')
export class Org extends BaseEntity {
  constructor() {
    super();

    this.parentId = undefined;
    this.name = undefined;
    this.shortName = undefined;
    this.orgType = undefined;
    this.orgLevel = undefined;
  }

  @Column({ comment: '父 id', nullable: true })
  parentId: string;

  @Column('varchar', { comment: '机构名称', length: 50 })
  name: string;

  @Column('varchar', { comment: '机构简称', length: 50, nullable: true })
  shortName: string;

  @Column('tinyint', { comment: '机构类型（0：机构；1：部门；)' })
  orgType: OrgType;

  @Column('varchar', { comment: '机构级次码', length: 100, nullable: true })
  orgLevel: string;
}
