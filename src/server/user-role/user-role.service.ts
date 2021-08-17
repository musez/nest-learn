import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { CreateUserRoleDto } from './dto/create-user-role.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { BaseFindByIdDto, BaseFindByIdsDto } from '../base.dto';
import { UserRole } from './entities/user-role.entity';

@Injectable()
export class UserRoleService {
  constructor(
    @InjectRepository(UserRole)
    private readonly userRoleRepository: Repository<UserRole>,
  ) {}

  /**
   * 添加
   */
  async insertBatch(dto: UserRole[]): Promise<UserRole[]> {
    return await this.userRoleRepository.save(dto);
  }

  /**
   * 获取角色
   */
  async selectByUserId(baseFindByIdDto: BaseFindByIdDto): Promise<UserRole[]> {
    const { id } = baseFindByIdDto;
    const ret = await this.userRoleRepository.find({
      relations: ['role'],
      where: {
        userId: id,
      },
    });

    return null;
  }

  /**
   * 获取用户组（批量）
   */
  async selectByUserIds(dto: BaseFindByIdsDto): Promise<UserRole[]> {
    const { ids } = dto;
    return await this.userRoleRepository.find({
      relations: ['role'],
      where: {
        id: In(ids.split(',')),
      },
    });
  }

  /**
   * 删除角色
   */
  async deleteByUserId(id: string): Promise<any> {
    return await this.userRoleRepository
      .createQueryBuilder()
      .delete()
      .from(UserRole)
      .where('userId = :id', { id: id })
      .execute();
  }
}
