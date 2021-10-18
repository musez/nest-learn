import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { BaseFindByIdsDto } from '../base.dto';
import { GroupRole } from './entities/group-role.entity';
import { Utils } from '../../utils';
import { ApiException } from '../../common/exception/api-exception';
import { ApiErrorCode } from '../../constants/api-error-code.enum';

@Injectable()
export class GroupRoleService {
  private readonly logger = new Logger(GroupRoleService.name);

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
      this.logger.error('系统异常：', e);
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  /**
   * 获取角色（批量）
   */
  async selectByIds(ids: string[]): Promise<GroupRole[]> {
    try {
      return await this.groupRoleRepository.find({
        relations: ['role'],
        where: {
          id: In(ids),
        },
      });
    } catch (e) {
      this.logger.error('系统异常：', e);
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  /**
   * 删除（用户组 id）
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
      this.logger.error('系统异常：', e);
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }
}
