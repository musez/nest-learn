import { ApiProperty, ApiPropertyOptional, PartialType, PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsInt, IsUUID } from 'class-validator';
import { BasePageDto } from '../../base.dto';
import { LimitHolidayDto } from './limit-holiday.dto';

export class SearchHolidayDto extends PickType(LimitHolidayDto, ['name', 'weekday', 'restType']) {
}
