import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getRepository, DeleteResult } from 'typeorm';
import { Staff } from './entities/staff.entity';
import { Role } from '../role/entities/role.entity';

@Injectable()
export class StaffService {
  constructor(
    @InjectRepository(Staff)
    private readonly staffRepository: Repository<Staff>,
  ) {
  }

  async insertRoles(id, roles) {
    let rolesEntity = [];
    let roleIds = roles.split(',');

    const staff = new Staff();

    for (let item of roleIds) {
      const role = new Role();
      role.id = item;
      rolesEntity.push(role);
    }

    staff.roles = rolesEntity;
    await this.staffRepository.save(staff);
  }

  async selectRoles(id) {
    return await this.staffRepository.findOne(id, { relations: ['roles'] });
  }
}
