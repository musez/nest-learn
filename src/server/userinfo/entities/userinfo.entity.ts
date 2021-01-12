import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  JoinTable,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  BeforeUpdate,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { BaseEntity } from '../../base.entity';
import { Area } from '../../area/entities/area.entity';

@Entity('userinfo')
export class Userinfo {
  @PrimaryGeneratedColumn('uuid', { comment: '主键 id' })
  id: string;

  @Column({ comment: '省份', nullable: true }) province: string;
  // @ManyToOne((type) => Area, (area) => area.id)
  // province: Area;

  @Column({ comment: '城市', nullable: true })
  city: string;
  // @ManyToOne((type) => Area, (area) => area.id)
  // city: Area;

  @Column({ comment: '区/县', nullable: true })
  district: string;
  // @ManyToOne((type) => Area, (area) => area.id)
  // district: Area;

  @Column({ comment: '详细地址', length: 100, nullable: true })
  address: string;

  @OneToOne((type) => User, (user) => user.userinfo)
  @JoinColumn()
  user: User;
}
