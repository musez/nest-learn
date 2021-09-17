import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { BasePageDto } from '../../base.dto';

export class LimitFeedbackDto extends PartialType(BasePageDto) {
  @ApiPropertyOptional({ description: '姓名' })
  readonly name?: string;

  @ApiPropertyOptional({ description: '手机号' })
  readonly mobile?: string;

  @ApiPropertyOptional({ description: '邮箱' })
  readonly email?: string;

  @ApiPropertyOptional({ description: '建议反馈类型' })
  readonly feedbackType?: number | string | (number | string)[];

  @ApiPropertyOptional({ description: '业务类型' })
  readonly businessType?: number | string | (number | string)[];

  @ApiPropertyOptional({ description: '状态（0：禁用；1：启用）' })
  // @IsOptional()
  // @Transform((value) => Number.parseInt(value))
  // @IsInt({ message: '查询类型必须为数字！' })
   readonly status?: string;
}
