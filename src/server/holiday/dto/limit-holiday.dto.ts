import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsInt, IsUUID } from 'class-validator';
import { BasePageDto } from '../../base.dto';

export class LimitHolidayDto extends PartialType(BasePageDto) {
  @ApiPropertyOptional({ description: '姓名' })
  readonly name?: string;

  @ApiPropertyOptional({ description: '周几' })
  readonly weekday?: number;

  @ApiPropertyOptional({ description: '上班类型' })
  readonly restType?: number;
}
