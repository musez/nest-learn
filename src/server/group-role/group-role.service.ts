import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { BaseFindByIdsDto } from '../base.dto';
import { GroupRole } from './entities/group-role.entity';
import { Utils } from '../../utils';
import { ApiException } from '../../common/exception/api-exception';
import { ApiErrorCode } from '../../constants/api-error-code.enum';

@Injectable()
export class GroupRoleService {
  constructor(
    @InjectRepository(GroupRole)
    private readonly groupRoleRepository: Repository<GroupRole>,
  ) {
  }

  /**
   * 添加
   */
  async insertBatch(groupRole: GroupRole[]): Promise<GroupRole[]> {
    try {
      return await this.groupRoleRepository.save(groupRole);
    } catch (e) {
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  /**
   * 获取用户组（批量）
   */
  async selectByGroupIds(ids: string[]): Promise<GroupRole[]> {
    try {
      return await this.groupRoleRepository.find({
        relations: ['role'],
        where: {
          id: In(ids),
        },
      });
    } catch (e) {
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  /**
   * 删除用户组
   */
  async deleteByGroupId(id: string): Promise<any> {
    try {
      return await this.groupRoleRepository
        .createQueryBuilder()
        .delete()
        .from(GroupRole)
        .where('groupId = :id', { id: id })
        .execute();
    } catch (e) {
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }
}
