import { IsNotEmpty, IsString, IsInt, IsEmail, MinLength, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class BaseDictItemDto {
  @ApiProperty({ description: '主键 id', required: true })
  @IsNotEmpty({ message: '主键 id 不能为空' })
  readonly id: string;

  @ApiProperty({ description: '字典项名称', example: '字典项名称1' })
  readonly itemText: string;

  @ApiProperty({ description: '字典项值', example: '字典项值1' })
  readonly itemValue: string;

  @ApiPropertyOptional({ description: '排序', default: 0 })
  @Transform(sort => Number.parseInt(sort))
  @IsInt({ message: '排序必须为数字！' })
  readonly sort?: number;
}
