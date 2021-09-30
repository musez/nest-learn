import {
  IsDefined,
  IsNotEmpty,
  IsUUID,
} from 'class-validator';
import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { CreateArticleDto } from './create-article.dto';

export class UpdateArticleCountDto extends PickType(CreateArticleDto, [
  'linkCount',
  'collectCount',
  'shareCount',
  'isComment',
  'commentCount',
]) {
  @ApiProperty({ description: '主键 id', example: null })
  @IsDefined({ message: '主键 id 不能为空！' })
  @IsNotEmpty({ message: '主键 id 不能为空！' })
  @IsUUID('all')
  readonly id: string;
}
