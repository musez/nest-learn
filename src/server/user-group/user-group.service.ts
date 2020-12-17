import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getRepository, DeleteResult } from 'typeorm';
import { CreateUserGroupDto } from './dto/create-user-group.dto';
import { UpdateUserGroupDto } from './dto/update-user-group.dto';
import { User } from '../user/entities/user.entity';
import { UserGroup } from './entities/user-group.entity';

@Injectable()
export class UserGroupService {
  constructor(
    @InjectRepository(UserGroup)
    private readonly userGroupService: Repository<UserGroup>,
  ) {
  }

  create(createUserGroupDto: CreateUserGroupDto) {
    return 'This action adds a new userGroup';
  }

  findAll() {
    return `This action returns all userGroup`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userGroup`;
  }

  update(id: number, updateUserGroupDto: UpdateUserGroupDto) {
    return `This action updates a #${id} userGroup`;
  }

  remove(id: number) {
    return `This action removes a #${id} userGroup`;
  }
}
