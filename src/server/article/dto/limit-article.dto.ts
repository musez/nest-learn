import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsInt, IsUUID, MaxLength } from 'class-validator';
import { BasePageDto } from '../../base.dto';

export class LimitArticleDto extends PartialType(BasePageDto) {
  @ApiPropertyOptional({ description: '标题' })
  readonly title?: string;

  @ApiPropertyOptional({ description: '文章类型' })
  readonly type?: number;

  @ApiPropertyOptional({ description: '状态' })
  readonly articleStatus?: number;
}
