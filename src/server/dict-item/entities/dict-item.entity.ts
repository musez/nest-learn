import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../base.entity';
import { Dict } from '../../dict/entities/dict.entity';
import { DefaultType } from '../../../constants/dicts.enum';

@Entity('sys_dict_item')
export class DictItem extends BaseEntity {
  constructor() {
    super();

    this.parentId = undefined;
    this.itemText = undefined;
    this.itemValue = undefined;
    this.defaultValue = undefined;
    this.sort = undefined;
    this.dict = undefined;
  }

  @Column({ comment: '父 id', nullable: true })
  parentId: string;

  @Column('varchar', { comment: '字典项名称', length: 50 })
  itemText: string;

  @Column('varchar', { comment: '字典项值', length: 50 })
  itemValue: string;

  @Column('tinyint', { comment: '默认值（0：否；1：是）' })
  defaultValue: DefaultType;

  @Column({ comment: '排序', default: () => 0 })
  sort: number;

  @ManyToOne((type) => Dict, (dict) => dict.dictItems)
  @JoinColumn()
  dict: Dict;

  @Column('uuid', { comment: '字典 id', nullable: true })
  dictId: string;
}
