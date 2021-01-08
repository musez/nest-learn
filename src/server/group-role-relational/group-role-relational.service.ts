import { Injectable } from '@nestjs/common';
import { CreateGroupRoleRelationalDto } from './dto/create-group-role-relational.dto';
import { UpdateGroupRoleRelationalDto } from './dto/update-group-role-relational.dto';

@Injectable()
export class GroupRoleRelationalService {
  create(createGroupRoleRelationalDto: CreateGroupRoleRelationalDto) {
    return 'This action adds a new groupRoleRelational';
  }

  findAll() {
    return `This action returns all groupRoleRelational`;
  }

  findOne(id: number) {
    return `This action returns a #${id} groupRoleRelational`;
  }

  update(id: number, updateGroupRoleRelationalDto: UpdateGroupRoleRelationalDto) {
    return `This action updates a #${id} groupRoleRelational`;
  }

  remove(id: number) {
    return `This action removes a #${id} groupRoleRelational`;
  }
}
