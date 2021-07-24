import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity('sys_userinfo')
export class Userinfo {
  constructor() {
    this.id = undefined;
    this.provinceId = undefined;
    this.cityId = undefined;
    this.districtId = undefined;
    this.address = undefined;
    this.user = undefined;
  }

  @PrimaryGeneratedColumn('uuid', { comment: '主键 id' })
  id: string;

  @Column({ comment: '省份', nullable: true })
  provinceId: number;

  @Column({ comment: '城市', nullable: true })
  cityId: number;

  @Column({ comment: '区/县', nullable: true })
  districtId: number;

  @Column({ comment: '详细地址', length: 100, nullable: true })
  address: string;

  @OneToOne((type) => User, (user) => user.userinfo)
  // @OneToOne(() => User)
  @JoinColumn()
  user: User;
}
