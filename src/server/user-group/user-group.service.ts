import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { CreateUserGroupDto } from './dto/create-user-group.dto';
import { UpdateUserGroupDto } from './dto/update-user-group.dto';
import { UserGroup } from './entities/user-group.entity';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { User } from '../user/entities/user.entity';
import { Userinfo } from '../userinfo/entities/userinfo.entity';
import { CreateGroupDto } from '../group/dto/create-group.dto';
import { BaseFindByIdDto } from '../base.dto';

@Injectable()
export class UserGroupService {
  constructor(
    @InjectRepository(UserGroup)
    private readonly userGroupRepository: Repository<UserGroup>,
  ) {
  }

  async insert(createUserGroupDto: CreateUserGroupDto[]): Promise<CreateUserGroupDto[]> {
    return await this.userGroupRepository.save(createUserGroupDto);
  }

  async selectByUserId(baseFindByIdDto: BaseFindByIdDto): Promise<UserGroup[]> {
    return await this.userGroupRepository.find({
      where: {
        userId: baseFindByIdDto,
      },
    });
  }

  // create(createUserGroupDto: CreateUserGroupDto) {
  //   return 'This action adds a new userGroup';
  // }
  //
  // findAll() {
  //   return `This action returns all userGroup`;
  // }
  //
  // findOne(id: number) {
  //   return `This action returns a #${id} userGroup`;
  // }
  //
  // update(id: number, updateUserGroupDto: UpdateUserGroupDto) {
  //   return `This action updates a #${id} userGroup`;
  // }
  //
  // remove(id: number) {
  //   return `This action removes a #${id} userGroup`;
  // }
}
