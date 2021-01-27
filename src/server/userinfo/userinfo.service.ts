import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserinfoDto } from './dto/create-userinfo.dto';
import { UpdateUserinfoDto } from './dto/update-userinfo.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { User } from '../user/entities/user.entity';
import { Userinfo } from './entities/userinfo.entity';
import { Utils } from '../../utils';
import set = Reflect.set;

@Injectable()
export class UserinfoService {
  constructor(
    @InjectRepository(Userinfo)
    private readonly userinfoRepository: Repository<Userinfo>,
  ) {
  }

  async insert(createUserinfoDto: CreateUserinfoDto, curUser?): Promise<CreateUserinfoDto> {
    return await this.userinfoRepository.save(createUserinfoDto);
  }

  async update(updateUserinfoDto: UpdateUserinfoDto): Promise<any> {
    let { id } = updateUserinfoDto;
    return await this.userinfoRepository.update(id, updateUserinfoDto);
  }

  async updateByUserId(userId: string, updateUserinfoDto: UpdateUserinfoDto): Promise<any> {
    return await this.userinfoRepository.createQueryBuilder('userinfo')
      .update(Userinfo)
      .set({
        provinceId: updateUserinfoDto.provinceId,
        cityId: updateUserinfoDto.cityId,
        districtId: updateUserinfoDto.districtId,
        address: updateUserinfoDto.address,
      })
      .where('userId = :userId', {
        userId: userId,
      })
      .execute();
  }
}
