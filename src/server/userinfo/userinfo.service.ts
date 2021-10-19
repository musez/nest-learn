import { Injectable, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserinfoDto } from './dto/create-userinfo.dto';
import { UpdateUserinfoDto } from './dto/update-userinfo.dto';
import { Userinfo } from './entities/userinfo.entity';
import { ApiException } from '../../common/exception/api-exception';
import { ApiErrorCode } from '../../constants/api-error-code.enum';
import { BaseFindByIdDto, BaseFindByIdsDto } from '../base.dto';
import { Utils } from '../../utils';

@Injectable()
export class UserinfoService {
  private readonly logger = new Logger(UserinfoService.name);

  constructor(
    @InjectRepository(Userinfo)
    private readonly userinfoRepository: Repository<Userinfo>,
  ) {
  }

  /**
   * 添加
   */
  async insert(createUserinfoDto: CreateUserinfoDto): Promise<CreateUserinfoDto> {
    try {
      return await this.userinfoRepository.save(createUserinfoDto);
    } catch (e) {
      this.logger.error('系统异常：', e);
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  /**
   * 添加（批量）
   */
  async insertBatch(createUserinfoDto: CreateUserinfoDto[]): Promise<CreateUserinfoDto[]> {
    try {
      return await this.userinfoRepository.save(createUserinfoDto);
    } catch (e) {
       throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  /**
   * 修改
   */
  async update(updateUserinfoDto: UpdateUserinfoDto): Promise<any> {
    try {
      const { id } = updateUserinfoDto;
      return await this.userinfoRepository.update(id, updateUserinfoDto);
    } catch (e) {
       throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  /**
   * 修改（userId）
   */
  async updateByUserId(id: string, updateUserinfoDto: UpdateUserinfoDto): Promise<any> {
    try {
      return await this.userinfoRepository
        .createQueryBuilder()
        .update(Userinfo)
        .set({
          provinceId: updateUserinfoDto.provinceId,
          cityId: updateUserinfoDto.cityId,
          districtId: updateUserinfoDto.districtId,
          address: updateUserinfoDto.address,
        })
        .where('userId = :userId', {
          userId: id,
        })
        .execute();
    } catch (e) {
       throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  /**
   * 删除
   */
  async deleteByUserId(baseFindByIdDto: BaseFindByIdDto, curUser?): Promise<void> {
    try {
      const { id } = baseFindByIdDto;

      const ret = await this.userinfoRepository
        .createQueryBuilder()
        .delete()
        .from(Userinfo)
        .where('userId = :userId', { userId: id })
        .execute();

      if (!ret) {
        throw new ApiException('删除异常！', ApiErrorCode.ERROR, HttpStatus.OK);
      }

      return null;
    } catch (e) {
      this.logger.error('系统异常：', e);
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  /**
   * 删除（批量）
   */
  async deleteByUserIds(baseFindByIdsDto: BaseFindByIdsDto, curUser?): Promise<void> {
    try {
      let { ids } = baseFindByIdsDto;

      if (!Utils.isArray(ids)) {
        ids = Utils.split(ids.toString());
      }
      const ret = await this.userinfoRepository
        .createQueryBuilder()
        .delete()
        .from(Userinfo)
        .where('userId IN (:userId)', { userId: ids })
        .execute();

      if (!ret) {
        throw new ApiException('删除异常！', ApiErrorCode.ERROR, HttpStatus.OK);
      }

      return null;
    } catch (e) {
      this.logger.error('系统异常：', e);
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }
}
