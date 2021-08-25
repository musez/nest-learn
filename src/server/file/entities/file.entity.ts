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
import { BaseEntity } from '../../base.entity';

@Entity('sys_file')
export class File extends BaseEntity {
  constructor() {
    super();

    this.type = undefined;
    this.key = undefined;
    this.originalName = undefined;
    this.encoding = undefined;
    this.mimeType = undefined;
    this.destination = undefined;
    this.fileName = undefined;
    this.path = undefined;
    this.size = undefined;
    this.fileType = undefined;
    this.fileUrl = undefined;
    this.extId = undefined;
  }

  @Column('varchar', { comment: '文件类型', nullable: true })
  type: number;

  @Column('varchar', { comment: '云文件 key', nullable: true })
  key: string;

  @Column('varchar', { comment: '文件原始名称', nullable: true })
  originalName: string;

  @Column('varchar', { comment: '文件编码', nullable: true })
  encoding: string;

  @Column('varchar', { comment: '文件 mimeType 类型', nullable: true })
  mimeType: string;

  @Column('varchar', { comment: '文件目录', nullable: true })
  destination: string;

  @Column('varchar', { comment: '文件名称', nullable: true })
  fileName: string;

  @Column({ comment: '文件路径', nullable: true })
  path: string;

  @Column({ comment: '文件大小', nullable: true })
  size: number;

  @Column({ comment: '文件类型', nullable: true })
  fileType: string;

  @Column({ comment: '文件地址', nullable: true })
  fileUrl: string;

  @Column('varchar', { comment: '文件显示名称', nullable: true })
  fileDisName: string;

  @Column('varchar', { comment: '关联 id', nullable: true })
  extId: string;
}
