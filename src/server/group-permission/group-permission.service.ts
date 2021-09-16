import { HttpStatus, Injectable } from '@nestjs/common';
import { BaseFindByIdDto, BaseFindByIdsDto } from '../base.dto';
import { Utils } from '../../utils';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { GroupPermission } from './entities/group-permission.entity';
import { ApiException } from '../../common/exception/api-exception';
import { ApiErrorCode } from '../../constants/api-error-code.enum';

@Injectable()
export class GroupPermissionService {
  constructor(
    @InjectRepository(GroupPermission)
    private readonly groupPermissionRepository: Repository<GroupPermission>,
  ) {
  }

  /**
   * 添加
   */
  async insertBatch(groupPermission: GroupPermission[]): Promise<GroupPermission[]> {
    try {
      return await this.groupPermissionRepository.save(groupPermission);
    } catch (e) {
       throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  /**
   * 获取权限
   */
  async selectByGroupId(baseFindByIdDto: BaseFindByIdDto): Promise<GroupPermission[]> {
    try {
      const { id } = baseFindByIdDto;
      const ret = await this.groupPermissionRepository.find({
        relations: ['permission'],
        where: {
          userId: id,
        },
      });

      return ret;
    } catch (e) {
       throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  /**
   * 获取权限（批量）
   */
  async selectByGroupIds(ids: string[]): Promise<GroupPermission[]> {
    try {
      return await this.groupPermissionRepository.find({
        relations: ['permission'],
        where: {
          id: In(ids),
        },
      });
    } catch (e) {
       throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  /**
   * 删除权限
   */
  async deleteByGroupId(id: string): Promise<any> {
    try {
      return await this.groupPermissionRepository
        .createQueryBuilder()
        .delete()
        .from(GroupPermission)
        .where('groupId = :id', { id: id })
        .execute();
    } catch (e) {
       throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }
}
