import { BaseEntity } from '../../base.entity';
import { Column, Entity } from 'typeorm';
import { WeekdayType, RestType } from '../../../constants/dicts';

@Entity('sys_holiday')
export class Holiday extends BaseEntity {
  constructor() {
    super();
  }

  @Column('varchar', { comment: '名称', length: 50, nullable: true })
  name: string;

  @Column({ type: 'date', comment: '日期', nullable: false })
  date: Date;

  @Column('tinyint', { comment: '周几（1：一；2：二；3：三；4：四；5：五；6：六；0：日）', nullable: true })
  weekday: WeekdayType;

  @Column('tinyint', { comment: '类型（0：工作日；1：法定节假日；2：休息日加班；3：休息日）', nullable: true, default: RestType.DEFAULT })
  restType: RestType;
}
