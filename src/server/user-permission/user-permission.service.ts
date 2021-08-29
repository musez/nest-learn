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
  async insertBatch(dto: UserPermission[]): Promise<UserPermission[]> {
    return await this.userPermissionRepository.save(dto);
  }

  /**
   * 获取角色
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
   * 获取用户组（批量）
   */
  async selectByUserIds(baseFindByIdsDto: BaseFindByIdsDto): Promise<UserPermission[]> {
    const { ids } = baseFindByIdsDto;
    const idsArr = Utils.split(ids);
    return await this.userPermissionRepository.find({
      relations: ['permission'],
      where: {
        id: In(idsArr),
      },
    });
  }

  /**
   * 删除角色
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
