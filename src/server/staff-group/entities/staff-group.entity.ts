import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  JoinTable,
  ManyToMany,
  OneToMany,
  BeforeUpdate,
  Tree,
  TreeChildren,
  TreeParent,
} from 'typeorm';
import { BaseEntity } from '../../entities/base.entity';
import { Staff } from '../../staff/entities/staff.entity';
import { Role } from '../../role/entities/role.entity';

@Entity('StaffGroup')
export class StaffGroup extends BaseEntity {
  @Column('varchar', {
    comment: '名称',
    length: 50,
  })
  userName: string;

  @ManyToMany(() => Staff, staff => staff.staffGroups)
  staffs: Staff[];

  @ManyToMany(() => Role, role => role.staffGroups)
  @JoinTable()
  roles: Role[];
}
