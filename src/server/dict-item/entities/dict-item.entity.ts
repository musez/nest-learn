import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { BaseEntity } from '../../entities/base.entity';
import { User } from '../../user/entities/user.entity';
import { Dict } from '../../dict/entities/dict.entity';
import { Area } from '../../area/entities/area.entity';

@Entity('dict_item')
export class DictItem extends BaseEntity {
  @Column('varchar', {
    comment: '字典项名称',
    length: 50,
  })
  itemText: string;

  @Column('varchar', {
    comment: '字典项编码',
    length: 50,
  })
  itemValue: string;

  @Column({
    comment: '排序',
  })
  sort: number;

  @ManyToOne((type) => Dict, (dict) => dict.dictItems)
  dict: Dict;
}
