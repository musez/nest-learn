import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserinfoDto } from './dto/create-userinfo.dto';
import { UpdateUserinfoDto } from './dto/update-userinfo.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { User } from '../user/entities/user.entity';
import { Userinfo } from './entities/userinfo.entity';
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
    console.log('userinfo 2:',updateUserinfoDto);

    let { id } = updateUserinfoDto;
    let isExist = await this.userinfoRepository.find({
      where: {
        userId: id,
      },
    });
    if (Utils.isEmpty(isExist)) {
      throw new BadRequestException(`数据 userId：${id} 不存在！`);
    }
    return await this.userinfoRepository.update(id, updateUserinfoDto);
  }
}
