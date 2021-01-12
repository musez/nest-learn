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
  @Column('varchar', { comment: '字典项名称', length: 50 })
  itemText: string;

  @Column('varchar', { comment: '字典项值', length: 50 })
  itemValue: string;

  @Column({ comment: '排序' })
  sort: number;

  @ManyToOne((type) => Dict, (dict) => dict.dictItemList)
  dict: Dict;
}
