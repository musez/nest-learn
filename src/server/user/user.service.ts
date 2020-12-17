import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getRepository, DeleteResult } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create.user.dto';
import { UpdateUserDto } from './dto/update.user.dto';
import { RegisterUserDto } from './dto/register.user.dto';
import { LoginUserDto } from './dto/login.user.dto';
import { DeleteUserDto } from './dto/delete.user.dto';

export type Users = any;

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

  async register(registerUserDto: RegisterUserDto): Promise<CreateUserDto> {
    return await this.userRepository.save(registerUserDto);
  }

  async insert(createUserDto: CreateUserDto): Promise<CreateUserDto> {
    return await this.userRepository.save(createUserDto);
  }

  async selectList(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async selectListPage(page: number, limit: number): Promise<any> {
    let offset = (page - 1) * limit;

    let res = await this.userRepository.createQueryBuilder('user')
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
    return await this.userRepository.findOne(id);
  }

  async update(updateUserDto: UpdateUserDto): Promise<void> {
    let { id } = updateUserDto;
    await this.userRepository.update({ id: id }, updateUserDto);
  }

  async deleteById(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }
}
