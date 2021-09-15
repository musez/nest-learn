import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserinfoDto } from './dto/create-userinfo.dto';
import { UpdateUserinfoDto } from './dto/update-userinfo.dto';
import { Userinfo } from './entities/userinfo.entity';
import { ApiException } from '../../common/exception/api-exception';
import { ApiErrorCode } from '../../constants/api-error-code.enum';

@Injectable()
export class UserinfoService {
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
      throw new ApiException(e.message, ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  /**
   * 添加（批量）
   */
  async insertBatch(createUserinfoDto: CreateUserinfoDto[]): Promise<CreateUserinfoDto[]> {
    try {
      return await this.userinfoRepository.save(createUserinfoDto);
    } catch (e) {
      throw new ApiException(e.message, ApiErrorCode.ERROR, HttpStatus.OK);
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
      throw new ApiException(e.message, ApiErrorCode.ERROR, HttpStatus.OK);
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
      throw new ApiException(e.message, ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }
}
