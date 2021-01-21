import { IsNotEmpty, IsString, IsInt, IsEmail } from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateArticleDto } from './create-article.dto';

export class UpdateArticleDto extends PartialType(CreateArticleDto) {
  @ApiProperty({ description: '主键 id' })
  @IsNotEmpty({ message: '主键 id 不能为空' })
  readonly id: string;
}
