import { PickType } from '@nestjs/swagger';
import { BaseAreaDto } from './base-area.dto';

export class CreateAreaDto extends PickType(BaseAreaDto, [
  'id',
  'parentId',
  'areaCode',
  'areaName',
  'level',
  'cityCode',
  'center',
  'long',
  'lat',
]) {
}
