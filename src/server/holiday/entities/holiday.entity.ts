import { BaseEntity } from '../../base.entity';
import { Column, Entity } from 'typeorm';

// 周几类型
export enum WeekdayType {
  SUNDAY = 0,
  MONDAY = 1,
  TUESDAY = 2,
  WEDNESDAY = 3,
  THURSDAY = 4,
  FRIDAY = 5,
  SATURDAY = 6,
}

// 上班类型
export enum RestType {
  DEFAULT = 0,
  UNREST = 1,
}

@Entity('sys_holiday')
export class Holiday extends BaseEntity {
  constructor() {
    super();
  }

  @Column('varchar', { comment: '名称', length: 50 })
  name: string;

  @Column({ type: 'date', comment: '日期', nullable: false })
  date: Date;

  @Column('tinyint', { comment: '（周几）一、二、三、四、五、六、日', nullable: true })
  weekday: WeekdayType;

  @Column('tinyint', { comment: '上班类型（0：休息；1：上班）', nullable: true, default: RestType.DEFAULT })
  restType: RestType;
}
