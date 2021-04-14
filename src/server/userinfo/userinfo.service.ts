import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserinfoDto } from './dto/create-userinfo.dto';
import { UpdateUserinfoDto } from './dto/update-userinfo.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { Userinfo } from './entities/userinfo.entity';
import { BaseFindByIdDto, BaseFindByIdsDto } from '../base.dto';

@Injectable()
export class UserinfoService {
  constructor(
    @InjectRepository(Userinfo)
    private readonly userinfoRepository: Repository<Userinfo>,
  ) {
  }

  /**
   * 添加（批量）
   */
  async insert(createUserinfoDto: CreateUserinfoDto): Promise<CreateUserinfoDto> {
    return await this.userinfoRepository.save(createUserinfoDto);
  }

  /**
   * 修改
   */
  async update(updateUserinfoDto: UpdateUserinfoDto): Promise<any> {
    let { id } = updateUserinfoDto;
    return await this.userinfoRepository.update(id, updateUserinfoDto);
  }

  /**
   * 修改（userId）
   */
  async updateByUserId(id: string, updateUserinfoDto: UpdateUserinfoDto): Promise<any> {
    return await this.userinfoRepository.createQueryBuilder()
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
  }

  /**
   * 删除
   */
  async deleteByUserId(id: string): Promise<any> {
    let res = await this.userinfoRepository.createQueryBuilder()
      .delete()
      .from(Userinfo)
      .where('userId = :userId', {
        userId: id,
      })
      .execute();

    return res;
  }

  /**
   * 删除（ids）
   */
  async deleteByUserIds(baseFindByIdsDto: BaseFindByIdsDto): Promise<any> {
    let res = await this.userinfoRepository.createQueryBuilder()
      .delete()
      .from(Userinfo)
      .where('userId in (:userIds)', {
        userIds: baseFindByIdsDto,
      })
      .execute();

    return res;
  }
}
