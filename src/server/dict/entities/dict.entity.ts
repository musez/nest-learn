import {
  Entity,
  Column,
  OneToMany,
} from 'typeorm';
import { BaseEntity } from '../../base.entity';
import { DictItem } from '../../dict-item/entities/dict-item.entity';

@Entity('dict')
export class Dict extends BaseEntity {
  @Column('varchar', {
    comment: '字典名称',
    length: 50,
  })
  dictCode: string;

  @Column('varchar', {
    comment: '字典编码',
    length: 50,
  })
  dictName: string;

  @Column('tinyint', {
    comment: '字典类型（0：string；1：number；）',
    nullable: true,
    default: 0,
  })
  type: number;

  @OneToMany((type) => DictItem, (dictItem) => dictItem.dict, {
    cascade: true,
  })
  dictItemList: DictItem[];
}