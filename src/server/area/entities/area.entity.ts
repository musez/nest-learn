import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AreaLevelType } from '../../../constants/enums';

@Entity('sys_area')
export class Area {
  // constructor() {
  //   this.id = undefined;
  //   this.parentId = undefined;
  //   this.areaCode = undefined;
  //   this.areaName = undefined;
  //   this.level = undefined;
  //   this.cityCode = undefined;
  //   this.center = undefined;
  //   this.createTime = undefined;
  //   this.createBy = undefined;
  //   this.updateTime = undefined;
  //   this.updateBy = undefined;
  // }

  @PrimaryGeneratedColumn({ comment: '主键 id' })
  id: number;

  @Column({ comment: '父 id' })
  parentId: number;

  @Column('varchar', { comment: '地区编码' })
  areaCode: string;

  @Column('varchar', { comment: '地区名称' })
  areaName: string;

  @Column('tinyint', { comment: '地区级别（1：省份 province；2：城市 city；3：区/县 district；4：街道/办 street）', nullable: true })
  level: AreaLevelType;

  @Column('varchar', { comment: '城市编码', nullable: true })
  cityCode: string;

  @Column('varchar', { comment: '城市中心点（即：经纬度坐标）', nullable: true })
  center: string;

  @CreateDateColumn({ comment: '创建时间', type: 'datetime', nullable: true })
  createTime: Date;

  @Column({ comment: '创建人 id', nullable: true })
  createBy: string;

  @UpdateDateColumn({ comment: '最后更新时间', type: 'datetime', nullable: true })
  updateTime: Date;

  @Column({ comment: '修改人 id', nullable: true })
  updateBy: string;
}
