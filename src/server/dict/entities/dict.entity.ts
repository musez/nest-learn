import {
  Entity,
  Column,
  OneToMany,
} from 'typeorm';
import { BaseEntity } from '../../base.entity';
import { DictItem } from '../../dict-item/entities/dict-item.entity';

// 字典类型
export enum DictType {
  TEXT = 0,
  NUM = 1,
}

@Entity('dict')
export class Dict extends BaseEntity {
  constructor() {
    super();
    this.dictName = undefined;
    this.dictCode = undefined;
    this.type = undefined;
    this.dictItems = undefined;
  }

  @Column('varchar', { comment: '字典名称', length: 50 })
  dictName: string;

  @Column('varchar', { comment: '字典编码', length: 50 })
  dictCode: string;

  @Column('tinyint', { comment: '字典类型（0：string；1：number；）', nullable: true, default: DictType.TEXT })
  type: DictType;

  @OneToMany((type) => DictItem, (dictItem) => dictItem.dict, { cascade: true })
  dictItems: DictItem[];
}
