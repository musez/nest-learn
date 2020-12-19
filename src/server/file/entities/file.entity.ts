import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  JoinTable,
  ManyToMany,
  OneToMany,
  BeforeUpdate,
} from 'typeorm';
import { BaseEntity } from '../../entities/base.entity';

@Entity('file')
export class File extends BaseEntity {
  @Column('varchar', {
    comment: '文件原始名称',
    nullable: true,
  })
  originalName: string;

  @Column('varchar', {
    comment: '文件编码',
    nullable: true,
  })
  encoding: string;

  @Column('varchar', {
    comment: '文件 mimeType 类型',
    nullable: true,
  })
  mimeType: string;

  @Column('varchar', {
    comment: '文件目录',
    nullable: true,
  })
  destination: string;

  @Column('varchar', {
    comment: '文件名称',
    nullable: true,
  })
  fileName: string;

  @Column({
    comment: '文件路径',
    nullable: true,
  })
  path: string;

  @Column({
    comment: '文件大小',
    nullable: true,
  })
  size: number;

  @Column({
    comment: '文件类型',
    nullable: true,
  })
  fileType: string;

  @Column({
    comment: '文件地址',
    nullable: true,
  })
  fileUrl: string;

  @Column('varchar', {
    comment: '关联 id',
    nullable: true,
  })
  extId: string;
}
