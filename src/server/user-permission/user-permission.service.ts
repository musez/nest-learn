import { Injectable } from '@nestjs/common';
import { BaseFindByIdDto, BaseFindByIdsDto } from '../base.dto';
import { Utils } from '../../utils';
import { In, Repository } from 'typeorm';
import { UserPermission } from './entities/user-permission.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserPermissionService {
  constructor(
    @InjectRepository(UserPermission)
    private readonly userPermissionRepository: Repository<UserPermission>,
  ) {
  }

  /**
   * 添加
   */
  async insertBatch(userPermission: UserPermission[]): Promise<UserPermission[]> {
    return await this.userPermissionRepository.save(userPermission);
  }

  /**
   * 获取权限
   */
  async selectByUserId(baseFindByIdDto: BaseFindByIdDto): Promise<UserPermission[]> {
    const { id } = baseFindByIdDto;
    const ret = await this.userPermissionRepository.find({
      relations: ['permission'],
      where: {
        userId: id,
      },
    });

    return ret;
  }

  /**
   * 获取权限（批量）
   */
  async selectByUserIds(ids: string[]): Promise<UserPermission[]> {
    return await this.userPermissionRepository.find({
      relations: ['permission'],
      where: {
        id: In(ids),
      },
    });
  }

  /**
   * 删除权限
   */
  async deleteByUserId(id: string): Promise<any> {
    return await this.userPermissionRepository
      .createQueryBuilder()
      .delete()
      .from(UserPermission)
      .where('userId = :id', { id: id })
      .execute();
  }
}
