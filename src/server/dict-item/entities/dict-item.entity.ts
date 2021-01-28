import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { BaseEntity } from '../../base.entity';
import { Dict } from '../../dict/entities/dict.entity';

@Entity('dict_item')
export class DictItem extends BaseEntity {
  constructor() {
    super();

    this.itemText = undefined;
    this.itemValue = undefined;
    this.sort = undefined;
    this.dict = undefined;
    this.parentId = undefined;
  }

  @Column('varchar', { comment: '字典项名称', length: 50 })
  itemText: string;

  @Column('varchar', { comment: '字典项值', length: 50 })
  itemValue: string;

  @Column({ comment: '排序', default: () => 0 })
  sort: number;

  @Column({ comment: '父 id' })
  parentId: string;

  @ManyToOne((type) => Dict, (dict) => dict.dictItems)
  dict: Dict;
}
