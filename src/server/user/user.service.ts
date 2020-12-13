import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getRepository, DeleteResult } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create.user.dto';
import { UpdateUserDto } from './dto/update.user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
  }

  // async insert(user: User): Promise<User> {
  //   return await this.userRepository.save(user);
  // }
  async insert(createUserDto: CreateUserDto): Promise<CreateUserDto> {
    return await this.userRepository.save(createUserDto);
  }

  // async batchInsert(user: User): Promise<User> {
  //   return await this.userRepository.save(user);
  // }

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

  // async count(): Promise<number> {
  //   return await this.userRepository.createQueryBuilder('user')
  //     .getManyAndCount();// 获取结果及（非分页的）查询结果总数
  // }

  async selectById(id: string): Promise<User> {
    return await this.userRepository.findOne(id);
  }

  async update(updateUserDto: UpdateUserDto): Promise<void> {
    await this.userRepository.update({ id: updateUserDto.id }, updateUserDto);
  }

  async deleteById(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }
}
