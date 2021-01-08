import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { CreateUserGroupRelationalDto } from './dto/create-user-group-relational.dto';
import { UpdateUserGroupRelationalDto } from './dto/update-user-group-relational.dto';
import { UserGroupRelational } from './entities/user-group-relational.entity';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { User } from '../user/entities/user.entity';
import { Userinfo } from '../userinfo/entities/userinfo.entity';
import { CreateGroupDto } from '../group/dto/create-group.dto';
import { BaseFindByIdDto } from '../base.dto';

@Injectable()
export class UserGroupRelationalService {
  constructor(
    @InjectRepository(UserGroupRelational)
    private readonly userGroupRelationalRepository: Repository<UserGroupRelational>,
  ) {
  }

  async insert(createUserGroupRelationalDto: CreateUserGroupRelationalDto[]): Promise<CreateUserGroupRelationalDto[]> {
    return await this.userGroupRelationalRepository.save(createUserGroupRelationalDto);
  }

  async selectByUserId(baseFindByIdDto: BaseFindByIdDto): Promise<UserGroupRelational[]> {
    return await this.userGroupRelationalRepository.find({
      where: {
        userId: baseFindByIdDto,
      },
    });
  }

  // create(createUserGroupRelationalDto: CreateUserGroupRelationalDto) {
  //   return 'This action adds a new userGroupRelational';
  // }
  //
  // findAll() {
  //   return `This action returns all userGroupRelational`;
  // }
  //
  // findOne(id: number) {
  //   return `This action returns a #${id} userGroupRelational`;
  // }
  //
  // update(id: number, updateUserGroupRelationalDto: UpdateUserGroupRelationalDto) {
  //   return `This action updates a #${id} userGroupRelational`;
  // }
  //
  // remove(id: number) {
  //   return `This action removes a #${id} userGroupRelational`;
  // }
}
