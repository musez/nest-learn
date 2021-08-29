import {
  PickType,
} from '@nestjs/swagger';
import { LimitHolidayDto } from './limit-holiday.dto';

export class SearchHolidayDto extends PickType(LimitHolidayDto, [
  'year',
  'name',
  'weekday',
  'restType',
  'status',
]) {}
