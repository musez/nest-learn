import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getRepository, DeleteResult } from 'typeorm';
import { Users } from './user.entity';
import { CreateUserDto } from './dto/create.user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
  ) {
  }

  async create(createUserDto: CreateUserDto): Promise<Users> {
    return await this.userRepository.save(createUserDto);
  }

  async findAll(): Promise<Users[]> {
    return await this.userRepository.find();
  }

  // 查找一条数据
  async findOne(id: string): Promise<Users> {
    return await this.userRepository.findOne({ id });
  }
}
