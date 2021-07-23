import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { SexType } from '../../../constants/dicts';
import { BaseEntity } from '../../base.entity';
import { ApiPropertyOptional } from '@nestjs/swagger';

@Entity('sys_user_address')
export class UserAddress extends BaseEntity {
  @PrimaryGeneratedColumn('uuid', { comment: '主键 id' })
  id: string;

  @Column('varchar', { comment: '姓名', length: 50, nullable: true })
  name: string;

  @Column('varchar', { comment: '手机号', length: 20, nullable: true })
  mobile: string;

  @Column('tinyint', { comment: '性别（0：保密；1：男；2：女）', nullable: true, default: SexType.DEFAULT })
  sex: SexType;

  @Column({ comment: '省份', nullable: true })
  provinceId: number;

  @Column({ comment: '城市', nullable: true })
  cityId: number;

  @Column({ comment: '区/县', nullable: true })
  districtId: number;

  @Column({ comment: '街道办', nullable: true })
  streetId: number;

  @Column({ comment: '详细地址', length: 100, nullable: true })
  address: string;

  // @Column('tinyint', { comment: '标签', nullable: true })
  // tag: number;
  //
  // @ApiPropertyOptional({ description: '默认值（0：否；1：是）', example: null })
  // readonly defaultValue?: number;
}
