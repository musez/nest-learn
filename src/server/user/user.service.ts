import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DeleteUserDto } from './dto/delete-user.dto';
import { Userinfo } from '../userinfo/entities/userinfo.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
  }

  async selectByName(userName: string): Promise<User | undefined> {
    const user = this.userRepository.findOne({ userName: userName });
    if (user) return user;
    else return null;
  }

  // async updateLoginCount(updateUserDto: UpdateUserDto): Promise<any> {
  //   return await this.userRepository.increment(updateUserDto, 'loginCount', 1);
  // }

  async insert(createUserDto: CreateUserDto): Promise<CreateUserDto> {
    let { userName } = createUserDto;

    let isExist = await this.userRepository.findOne({ userName: userName });
    if (isExist) {
      throw new BadRequestException(`用户名 ${userName} 已存在！`);
    }

    let user = new User();

    for (let key in createUserDto) {
      if (createUserDto[key] !== null && createUserDto[key] !== 0) {
        user[key] = createUserDto[key];
      }
    }

    let userinfo = new Userinfo();
    for (let key in createUserDto) {
      if (createUserDto[key] !== null && createUserDto[key] !== 0) {
        userinfo[key] = createUserDto[key];
      }
    }

    user.userinfo = userinfo;

    return await this.userRepository.save(user);
  }

  async selectList(query): Promise<User[]> {
    let { userName } = query;

    if (!userName) {
      userName = '';
    }

    return await this.userRepository.find({
      relations: ['userinfo'],
      where: {
        userName: Like(`%${userName}%`),
      },
    });
  }

  async selectListPage(query): Promise<any> {
    let { userName, mobile, page, limit } = query;
    page = page ? page : 1;
    limit = limit ? limit : 10;
    let offset = (page - 1) * limit;

    if (!userName) {
      userName = '';
    }

    if (!mobile) {
      mobile = '';
    }

    let res = await this.userRepository.createQueryBuilder('user')
      .innerJoinAndSelect('user.userinfo', 'userinfo')
      .skip(offset)
      .take(limit)
      .orderBy('user.createTime', 'ASC')
      .where('user.userName like :userName', { userName: `%${userName}%` })
      .andWhere('user.mobile = :mobile', { mobile: mobile })
      .getManyAndCount();

    return {
      list: res[0],
      total: res[1],
      page: page,
      limit: limit,
    };
  }

  async selectById(id: string): Promise<User> {
    return await this.userRepository.findOne(id, { relations: ['userinfo'] });
  }

  async update(updateUserDto: UpdateUserDto): Promise<void> {
    let {
      id,
    } = updateUserDto;

    let isExist = await this.userRepository.findOne(id);
    if (!isExist) {
      throw new BadRequestException(`数据 id = ${id} 不存在！`);
    }

    let user = new User();

    for (let cityKey in updateUserDto) {
      if (updateUserDto[cityKey] !== null && updateUserDto[cityKey] !== 0) {
        user[cityKey] = updateUserDto[cityKey];
      }
    }

    let userinfo = new Userinfo();
    for (let key in updateUserDto) {
      if (updateUserDto[key] !== null && updateUserDto[key] !== 0) {
        userinfo[key] = updateUserDto[key];
      }
    }

    user.userinfo = userinfo;

    // await this.userRepository.update({ id: id }, updateUserDto);
    await this.userRepository.save(updateUserDto);
  }

  async deleteById(id: string): Promise<void> {
    let isExist = await this.userRepository.findOne(id);
    if (!isExist) {
      throw new BadRequestException(`数据 id = ${id} 不存在！`);
    }

    await this.userRepository.remove(isExist);
  }
}
