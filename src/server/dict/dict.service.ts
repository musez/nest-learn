import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDictDto } from './dto/create-dict.dto';
import { UpdateDictDto } from './dto/update-dict.dto';
import { Dict } from './entities/dict.entity';

@Injectable()
export class DictService {
  constructor(
    @InjectRepository(Dict)
    private readonly dictRepository: Repository<Dict>,
  ) {
  }

  async insert(createDictDto: CreateDictDto) {
    return await this.dictRepository.save(createDictDto);
  }

  async selectList(): Promise<Dict[]> {
    return await this.dictRepository.find();
  }

  async selectListPage(query): Promise<any> {
    let { page, limit } = query;
    page = page ? page : 1;
    limit = limit ? limit : 10;
    let offset = (page - 1) * limit;

    let res = await this.dictRepository.createQueryBuilder('dict')
      .orderBy('dict.createTime', 'ASC')
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

  async selectById(id: string): Promise<Dict> {
    return await this.dictRepository.findOne(id);
  }

  async update(updateDictDto: UpdateDictDto): Promise<void> {
    let { id } = updateDictDto;
    await this.dictRepository.update({ id: id }, updateDictDto);
  }

  async deleteById(id: string): Promise<void> {
    let user = await this.dictRepository.findOne(id);
    if (!user) {
      throw new BadRequestException(`数据 id = ${id} 不存在！`);
    }

    await this.dictRepository.remove(user);
  }
}
