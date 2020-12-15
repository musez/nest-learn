import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getRepository, DeleteResult } from 'typeorm';
import { Staff } from './entities/staff.entity';
import { Role } from '../role/entities/role.entity';
import { StaffGroup } from '../staff-group/entities/staff-group.entity';

@Injectable()
export class StaffService {
  constructor(
    @InjectRepository(Staff)
    private readonly staffRepository: Repository<Staff>,
  ) {
  }

  async insertGroups(id, groups) {
    let staffGroupsEntity = [];
    let groupIds = groups.split(',');

    const staff = new Staff();

    for (let item of groupIds) {
      const staffGroup = new StaffGroup();
      // staffGroup.id = item;
      staffGroupsEntity.push(staffGroup);
    }

    // staff.groups = groupsEntity;
    await this.staffRepository.save(staff);
  }

  async selectGroups(id) {
    return await this.staffRepository.findOne(id, { relations: ['roles'] });
  }
}
