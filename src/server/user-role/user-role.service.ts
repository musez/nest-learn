import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { BaseFindByIdDto, BaseFindByIdsDto } from '../base.dto';
import { UserRole } from './entities/user-role.entity';
import { Utils } from '../../utils';
import { ApiException } from '../../common/exception/api-exception';
import { ApiErrorCode } from '../../constants/api-error-code.enum';

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
  async insertBatch(userRole: UserRole[]): Promise<UserRole[]> {
    try {
      return await this.userRoleRepository.save(userRole);
    } catch (e) {
      throw new ApiException(e.errorMessage, ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  /**
   * 获取角色
   */
  async selectByUserId(baseFindByIdDto: BaseFindByIdDto): Promise<UserRole[]> {
    try {
      const { id } = baseFindByIdDto;
      const ret = await this.userRoleRepository.find({
        relations: ['role'],
        where: {
          userId: id,
        },
      });

      return null;
    } catch (e) {
      throw new ApiException(e.errorMessage, ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  /**
   * 获取用户组（批量）
   */
  async selectByUserIds(ids: string[]): Promise<UserRole[]> {
    try {
      return await this.userRoleRepository.find({
        relations: ['role'],
        where: {
          id: In(ids),
        },
      });
    } catch (e) {
      throw new ApiException(e.errorMessage, ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  /**
   * 删除角色
   */
  async deleteByUserId(id: string): Promise<any> {
    try {
      return await this.userRoleRepository
        .createQueryBuilder()
        .delete()
        .from(UserRole)
        .where('userId = :id', { id: id })
        .execute();
    } catch (e) {
      throw new ApiException(e.errorMessage, ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }
}
