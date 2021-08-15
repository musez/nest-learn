import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsInt, IsUUID } from 'class-validator';
import { BasePageDto } from '../../base.dto';

export class LimitHolidayDto extends PartialType(BasePageDto) {
  @ApiPropertyOptional({ description: '年份' })
  readonly year?: number;

  @ApiPropertyOptional({ description: '名称' })
  readonly name?: string;

  @ApiPropertyOptional({ description: '周几' })
  readonly weekday?: number;

  @ApiPropertyOptional({ description: '类型（0：工作日；1：法定节假日；2：休息日加班；3：休息日）' })
  readonly restType?: number;
}
