import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Utils } from './../../utils/index';
import { CreateDictDto } from './dto/create-dict.dto';
import { UpdateDictDto } from './dto/update-dict.dto';
import { Dict } from './entities/dict.entity';
import { DictItem } from '../dict-item/entities/dict-item.entity';
import { BaseFindByIdDto } from '../base.dto';

@Injectable()
export class DictService {
  constructor(
    @InjectRepository(Dict)
    private readonly dictRepository: Repository<Dict>,
  ) {
  }

  async insert(curUser, createDictDto: CreateDictDto) {
    return await this.dictRepository.save(createDictDto);
  }

  async selectList(): Promise<Dict[]> {
    return await this.dictRepository.find({
      relations: ['dictItems'],
    });
  }

  async selectListPage(query): Promise<any> {
    let { page, limit } = query;
    page = page ? page : 1;
    limit = limit ? limit : 10;
    let offset = (page - 1) * limit;

    let res = await this.dictRepository.createQueryBuilder('dict')
      .innerJoinAndSelect('dict.dictItems', 'dictItems')
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

  async selectById(baseFindByIdDto: BaseFindByIdDto): Promise<Dict> {
    let { id } = baseFindByIdDto;
    return await this.dictRepository.findOne(id, {
      relations: ['dictItems'],
    });
  }

  async update(updateDictDto: UpdateDictDto, curUser?): Promise<any> {
    let { id, dictItems } = updateDictDto;

    let isExist = await this.dictRepository.findOne(id);
    if (Utils.isNil(isExist)) {
      throw new BadRequestException(`数据 id：${id} 不存在！`);
    }

    let dict = new Dict();
    Utils.dto2entity(updateDictDto, dict);

    if (dictItems) {
      for (const key in dictItems) {
        let dictItem = new DictItem();

        for (const itemKey in dictItems[key]) {
          if (dictItems[key][itemKey]) {
            dictItem[itemKey] = dictItems[key][itemKey];
          }
        }
        dictItem.dict = dict;
      }
    }

    // let result = await this.dictRepository.update({ id: id }, updateDictDto);
    let result = await this.dictRepository.save(updateDictDto);

    return result;
  }

  async deleteById(baseFindByIdDto: BaseFindByIdDto): Promise<void> {
    let { id } = baseFindByIdDto;
    let isExist = await this.dictRepository.findOne(id);
    if (Utils.isNil(isExist)) {
      throw new BadRequestException(`数据 id：${id} 不存在！`);
    }

    await this.dictRepository.remove(isExist);
  }
}
