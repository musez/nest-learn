import { PickType } from '@nestjs/swagger';
import { BaseHolidayDto } from './base-holiday.dto';

export class CreateHolidayDto extends PickType(BaseHolidayDto,
  ['name', 'date', 'weekday', 'restType', 'status', 'description']) {
}
