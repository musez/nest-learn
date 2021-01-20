import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm';

@Entity('area')
export class Area {
  @PrimaryGeneratedColumn({ comment: '主键 id' })
  id: number;

  @Column({ comment: '父 id', nullable: true })
  parentId: number;

  @Column('varchar', { comment: '地区编码', nullable: true })
  areaCode: string;

  @Column('varchar', { comment: '地区编码', nullable: true })
  areaName: string;

  @Column('tinyint', { comment: '地区级别（1：省份 province；2：市 city；3：区县 district；4：街道 street）', nullable: true })
  level: number;

  @Column('varchar', { comment: '城市编码', nullable: true })
  cityCode: string;

  @Column('varchar', { comment: '城市中心点（即：经纬度坐标）', nullable: true })
  center: string;

  @CreateDateColumn({ comment: '创建时间', type: 'datetime' })
  createTime: Date;

  @Column({ comment: '创建人 id', nullable: true })
  createBy: string;

  @UpdateDateColumn({ comment: '修改时间', type: 'datetime' })
  updateTime: Date;

  @Column({ comment: '修改人 id', nullable: true })
  updateBy: string;
}
