import { PartialType } from '@nestjs/mapped-types';
import { CreateArticleCollectDto } from './create-article-collect.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty } from 'class-validator';

export class UpdateArticleCollectDto extends PartialType(CreateArticleCollectDto) {
  @ApiProperty({ description: '主键 id', example: null })
  @IsDefined({ message: '主键 id 不能为空！' })
  @IsNotEmpty({ message: '主键 id 不能为空！' })
  readonly id: string;
}
