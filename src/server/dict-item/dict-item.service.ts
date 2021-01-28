import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDictItemDto } from './dto/create-dict-item.dto';
import { UpdateDictItemDto } from './dto/update-dict-item.dto';
import { DictItem } from './entities/dict-item.entity';

@Injectable()
export class DictItemService {
  constructor(
    @InjectRepository(DictItem)
    private readonly dictItemRepository: Repository<DictItem>,
  ) {
  }

  async insertBatch(createUserinfoDto: CreateDictItemDto[]): Promise<CreateDictItemDto[]> {
    return await this.dictItemRepository.save(createUserinfoDto);
  }
}
