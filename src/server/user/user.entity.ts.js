/**
 * @name: user.schema.ts
 * @author: wy
 * @date: 20201021 09:18
 * @description：user.schema.ts
 * @update: 20201021 09:18
 */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  JoinTable,
  ManyToMany,
  OneToMany,
  BeforeUpdate
} from 'typeorm';
import { IsEmail } from 'class-validator';
import * as argon2 from 'argon2';

@Entity('admin')
export class AdminEntity {

  @PrimaryGeneratedColumn()
  userId: number;

  @Column()
  userName: string;
}
