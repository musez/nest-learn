import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { CreateUserRoleDto } from './dto/create-user-role.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { UserGroup } from '../user-group/entities/user-group.entity';
import { CreateUserGroupDto } from '../user-group/dto/create-user-group.dto';
import { BaseFindByIdDto } from '../base.dto';
import { UserRole } from './entities/user-role.entity';

@Injectable()
export class UserRoleService {
  constructor(
    @InjectRepository(UserRole)
    private readonly userRoleRepository: Repository<UserRole>,
  ) {
  }

  /**
   * 添加
   */
  async insert(createUserRoleDto: CreateUserRoleDto[]): Promise<CreateUserRoleDto[]> {
    return await this.userRoleRepository.save(createUserRoleDto);
  }

  async selectByUserId(baseFindByIdDto: BaseFindByIdDto): Promise<UserRole[]> {
    return await this.userRoleRepository.find({
      relations: ['role'],
      where: {
        userId: baseFindByIdDto,
      },
    });
  }
}
