import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserinfoDto } from './dto/create-userinfo.dto';
import { UpdateUserinfoDto } from './dto/update-userinfo.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { User } from '../user/entities/user.entity';
import { Userinfo } from './entities/userinfo.entity';
import { BaseFindByIdDto, BaseFindByIdsDto } from '../base.dto';
import { Utils } from '../../utils';

@Injectable()
export class UserinfoService {
  constructor(
    @InjectRepository(Userinfo)
    private readonly userinfoRepository: Repository<Userinfo>,
  ) {
  }

  async insert(createUserinfoDto: CreateUserinfoDto): Promise<CreateUserinfoDto> {
    return await this.userinfoRepository.save(createUserinfoDto);
  }

  async update(updateUserinfoDto: UpdateUserinfoDto): Promise<any> {
    let { id } = updateUserinfoDto;
    return await this.userinfoRepository.update(id, updateUserinfoDto);
  }

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
