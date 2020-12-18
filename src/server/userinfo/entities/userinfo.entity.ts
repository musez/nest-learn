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
export class Userinfo extends BaseEntity {
  @OneToOne((type) => User, (user) => user.userinfo)
  @JoinColumn()
  user: User;
}
