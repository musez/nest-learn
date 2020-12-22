import { Injectable } from '@nestjs/common';
import { CreateDictItemDto } from './dto/create-dict-item.dto';
import { UpdateDictItemDto } from './dto/update-dict-item.dto';

@Injectable()
export class DictItemService {
  create(createDictItemDto: CreateDictItemDto) {
    return 'This action adds a new dictItem';
  }

  findAll() {
    return `This action returns all dictItem`;
  }

  findOne(id: number) {
    return `This action returns a #${id} dictItem`;
  }

  update(id: number, updateDictItemDto: UpdateDictItemDto) {
    return `This action updates a #${id} dictItem`;
  }

  remove(id: number) {
    return `This action removes a #${id} dictItem`;
  }
}
