import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsInt, IsUUID, MaxLength } from 'class-validator';
import { BasePageDto } from '../../base.dto';

export class LimitArticleCatDto extends PartialType(BasePageDto) {
  @ApiPropertyOptional({ description: '栏目名称' })
  readonly catName?: string;
}
