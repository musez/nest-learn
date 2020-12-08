import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getRepository, DeleteResult } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create.user.dto';

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

  async selectListPage(page: number, limit: number): Promise<User[]> {
    let offset = (page - 1) * limit;
    return await this.userRepository.createQueryBuilder('user')
      .skip(offset)
      .take(limit)
      .getMany();

    // .getManyAndCount() // 获取结果及(非分页的)查询结果总数
  }

  async selectById(id: string): Promise<User> {
    return await this.userRepository.findOne(id);
  }

  async update(user: User): Promise<void> {
    await this.userRepository.update({ id: user.id }, user);
  }

  async deleteById(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }
}
