import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { CreateUserRoleDto } from './dto/create-user-role.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
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
  async insertBatch(createUserRoleDto: CreateUserRoleDto[]): Promise<CreateUserRoleDto[]> {
    // @ts-ignore
    return await this.userRoleRepository.save(createUserRoleDto);
  }

  /**
   * 获取角色
   */
  async selectByUserId(baseFindByIdDto: BaseFindByIdDto): Promise<UserRole[]> {
    return await this.userRoleRepository.find({
      // relations: ['role'],
      where: {
        userId: baseFindByIdDto,
      },
    });
  }

  /**
   * 删除角色
   */
  async deleteByUserId(id: string): Promise<any> {
    return await this.userRoleRepository.createQueryBuilder()
      .delete()
      .from(UserRole)
      .where('userId = :id', { id: id })
      .execute();
  }
}
