import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { BasePageDto } from '../../base.dto';

export class LimitHolidayDto extends PartialType(BasePageDto) {
  @ApiPropertyOptional({ description: '年份' })
  readonly year?: number;

  @ApiPropertyOptional({ description: '名称' })
  readonly name?: string;

  @ApiPropertyOptional({ description: '周几' })
  readonly weekday?: number;

  @ApiPropertyOptional({
    description: '类型（0：工作日；1：法定节假日；2：休息日加班；3：休息日）',
  })
  readonly restType?: number;

  @ApiPropertyOptional({ description: '状态，多个使用逗号“,”分隔（0：禁用；1：启用）', example: 1 })
   readonly status?: string;
}
