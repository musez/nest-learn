import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { DeleteUserDto } from './dto/delete-user.dto';

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
    let user = await this.userRepository.findOne({ userName: userName });
    if (user) {
      throw new BadRequestException(`用户名 ${userName} 已存在！`);
    }
    return await this.userRepository.save(createUserDto);
  }

  async selectList(query): Promise<User[]> {
    let { userName } = query;

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

    let res = await this.userRepository.createQueryBuilder('user')
      .innerJoinAndSelect('user.userinfo', 'userinfo')
      .orderBy('user.createTime', 'ASC')
      .where('user.userName = :userName', { userName: `%${userName}%` })
      .andWhere('user.mobile = :mobile', { mobile: mobile })
      .skip(offset)
      .take(limit)
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
    let { id } = updateUserDto;
    // save
    await this.userRepository.update({ id: id }, updateUserDto);
    // await this.userRepository.save(updateUserDto);
  }

  async deleteById(id: string): Promise<void> {
    let user = await this.userRepository.findOne(id);
    if (!user) {
      throw new BadRequestException(`数据 id = ${id} 不存在！`);
    }

    await this.userRepository.remove(user);
  }
}
