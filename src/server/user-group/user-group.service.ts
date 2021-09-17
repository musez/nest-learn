import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { CreateUserGroupDto } from './dto/create-user-group.dto';
import { UpdateUserGroupDto } from './dto/update-user-group.dto';
import { UserGroup } from './entities/user-group.entity';
import { BaseFindByIdDto } from '../base.dto';
import { ApiException } from '../../common/exception/api-exception';
import { ApiErrorCode } from '../../constants/api-error-code.enum';

@Injectable()
export class UserGroupService {
  constructor(
    @InjectRepository(UserGroup)
    private readonly userGroupRepository: Repository<UserGroup>,
  ) {
  }

  /**
   * 添加
   */
  async insert(userGroup: UserGroup): Promise<CreateUserGroupDto | UserGroup> {
    try {
      return await this.userGroupRepository.save(userGroup);
    } catch (e) {
       throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  /**
   * 添加（批量）
   */
  async insertBatch(userGroup: UserGroup[]): Promise<CreateUserGroupDto[] | UserGroup[]> {
    try {
      return await this.userGroupRepository.save(userGroup);
    } catch (e) {
       throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  /**
   * 获取用户组（用户 id）
   */
  async selectByUserId(baseFindByIdDto: BaseFindByIdDto): Promise<UserGroup[]> {
    try {
      const { id } = baseFindByIdDto;
      const ret = await this.userGroupRepository.find({
        relations: ['group'],
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
   * 获取用户组（批量，用户 id）
   */
  async selectByIds(ids: string[]): Promise<UserGroup[]> {
    try {
      return await this.userGroupRepository.find({
        relations: ['group'],
        where: {
          id: In(ids),
        },
      });
    } catch (e) {
       throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  /**
   * 删除（用户 id）
   */
  async deleteByUserId(id: string): Promise<any> {
    try {
      return await this.userGroupRepository
        .createQueryBuilder()
        .delete()
        .from(UserGroup)
        .where('userId = :id', { id: id })
        .execute();
    } catch (e) {
       throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }
}
