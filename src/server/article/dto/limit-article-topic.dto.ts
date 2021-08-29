import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsUUID,
  IsDefined,
} from 'class-validator';
import { BasePageDto } from '../../base.dto';

export class LimitArticleTopDto extends PartialType(BasePageDto) {
  @ApiProperty({ description: '主键 id', example: null })
  @IsDefined({ message: '主键 id 不能为空！' })
  @IsNotEmpty({ message: '主键 id 不能为空！' })
  @IsUUID('all')
  readonly id: string;
}
