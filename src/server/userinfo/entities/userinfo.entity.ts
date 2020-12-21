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
  OneToMany,
  OneToOne,
  BeforeUpdate,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { BaseEntity } from '../../entities/base.entity';

@Entity('userinfo')
export class Userinfo {
  @PrimaryGeneratedColumn('uuid', {
    comment: '主键 id',
  })
  id: string;

  @Column({
    comment: '省份',
    nullable: true,
  })
  provinceId: number;

  @Column({
    comment: '城市',
    nullable: true,
  })
  cityId: number;

  @Column({
    comment: '区/县',
    nullable: true,
  })
  districtId: number;

  @Column({
    comment: '详细地址',
    length: 100,
    nullable: true,
  })
  address: string;

  @OneToOne((type) => User, (user) => user.userinfo)
  @JoinColumn()
  user: User;
}
