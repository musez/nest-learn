import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { SexType } from '../../../constants/dicts.enum';
import { BaseEntity } from '../../base.entity';
import { User } from '../../user/entities/user.entity';

@Entity('sys_user_address')
export class UserAddress extends BaseEntity {
  constructor() {
    super();

    this.name = undefined;
    this.mobile = undefined;
    this.sex = undefined;
    this.provinceId = undefined;
    this.cityId = undefined;
    this.districtId = undefined;
    // this.streetId = undefined;
    this.address = undefined;
  }

  @Column('varchar', { comment: '姓名', length: 50, nullable: true })
  name: string;

  @Column('varchar', { comment: '手机号', length: 20, nullable: true })
  mobile: string;

  @Column('tinyint', {
    comment: '性别（0：保密；1：男；2：女）',
    nullable: true,
    default: SexType.SECRET,
  })
  sex: SexType;

  @Column({ comment: '省份', nullable: true })
  provinceId: number;

  @Column({ comment: '城市', nullable: true })
  cityId: number;

  @Column({ comment: '区/县', nullable: true })
  districtId: number;

  // @Column({ comment: '街道/办', nullable: true })
  // streetId: number;

  @Column({ comment: '详细地址', length: 100, nullable: true })
  address: string;

  @ManyToOne((type) => User, (user) => user.userAddress)
  user: User;
}
