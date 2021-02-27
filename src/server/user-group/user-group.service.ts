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

  /**
   * 添加
   */
  async insert(createUserGroupDto: CreateUserGroupDto[]): Promise<CreateUserGroupDto[]> {
    return await this.userGroupRepository.save(createUserGroupDto);
  }

  async selectByUserId(baseFindByIdDto: BaseFindByIdDto): Promise<UserGroup[]> {
    return await this.userGroupRepository.find({
      relations: ['group'],
      where: {
        userId: baseFindByIdDto,
      },
    });
  }
}
