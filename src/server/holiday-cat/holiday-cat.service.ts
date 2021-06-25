import { Injectable } from '@nestjs/common';
import { CreateHolidayCatDto } from './dto/create-holiday-cat.dto';
import { UpdateHolidayCatDto } from './dto/update-holiday-cat.dto';

@Injectable()
export class HolidayCatService {
  create(createHolidayCatDto: CreateHolidayCatDto) {
    return 'This action adds a new holidayCat';
  }

  findAll() {
    return `This action returns all holidayCat`;
  }

  findOne(id: number) {
    return `This action returns a #${id} holidayCat`;
  }

  update(id: number, updateHolidayCatDto: UpdateHolidayCatDto) {
    return `This action updates a #${id} holidayCat`;
  }

  remove(id: number) {
    return `This action removes a #${id} holidayCat`;
  }
}
