import { HttpStatus, Injectable } from '@nestjs/common';
import { BaseFindByIdDto, BaseFindByIdsDto } from '../base.dto';
import { Utils } from '../../utils';
import { In, Repository } from 'typeorm';
import { UserPermission } from './entities/user-permission.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ApiException } from '../../common/exception/api-exception';
import { ApiErrorCode } from '../../constants/api-error-code.enum';

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
    try {
      return await this.userPermissionRepository.save(userPermission);
    } catch (e) {
       throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  /**
   * 获取权限
   */
  async selectByUserId(baseFindByIdDto: BaseFindByIdDto): Promise<UserPermission[]> {
    try {
      const { id } = baseFindByIdDto;
      const ret = await this.userPermissionRepository.find({
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
  async selectByUserIds(ids: string[]): Promise<UserPermission[]> {
    try {
      return await this.userPermissionRepository.find({
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
  async deleteByUserId(id: string): Promise<any> {
    try {
      return await this.userPermissionRepository
        .createQueryBuilder()
        .delete()
        .from(UserPermission)
        .where('userId = :id', { id: id })
        .execute();
    } catch (e) {
       throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }
}
