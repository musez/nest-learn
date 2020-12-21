import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getRepository, DeleteResult } from 'typeorm';
import { CreateUserinfoDto } from './dto/create-userinfo.dto';
import { UpdateUserinfoDto } from './dto/update-userinfo.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { User } from '../user/entities/user.entity';
import { Userinfo } from './entities/userinfo.entity';

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

  // create(createUserinfoDto: CreateUserinfoDto) {
  //   return 'This action adds a new userinfo';
  // }

  // findAll() {
  //   return `This action returns all userinfo`;
  // }
  //
  // findOne(id: number) {
  //   return `This action returns a #${id} userinfo`;
  // }
  //
  // update(id: number, updateUserinfoDto: UpdateUserinfoDto) {
  //   return `This action updates a #${id} userinfo`;
  // }
  //
  // remove(id: number) {
  //   return `This action removes a #${id} userinfo`;
  // }
}
