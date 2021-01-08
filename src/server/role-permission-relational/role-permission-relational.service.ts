import { Injectable } from '@nestjs/common';
import { CreateRolePermissionRelationalDto } from './dto/create-role-permission-relational.dto';
import { UpdateRolePermissionRelationalDto } from './dto/update-role-permission-relational.dto';

@Injectable()
export class RolePermissionRelationalService {
  create(createRolePermissionRelationalDto: CreateRolePermissionRelationalDto) {
    return 'This action adds a new rolePermissionRelational';
  }

  findAll() {
    return `This action returns all rolePermissionRelational`;
  }

  findOne(id: number) {
    return `This action returns a #${id} rolePermissionRelational`;
  }

  update(id: number, updateRolePermissionRelationalDto: UpdateRolePermissionRelationalDto) {
    return `This action updates a #${id} rolePermissionRelational`;
  }

  remove(id: number) {
    return `This action removes a #${id} rolePermissionRelational`;
  }
}
