import { IsNotEmpty, IsString, IsInt, IsEmail, IsUUID } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class BasePageDto {
  @ApiPropertyOptional({ description: '当前页数', example: 1 })
  @Transform(page => Number.parseInt(page))
  @IsInt({ message: '当前页数必须为数字' })
  readonly page?: number;

  @ApiPropertyOptional({ description: '每页条数', example: 10 })
  @Transform(limit => Number.parseInt(limit))
  @IsInt({ message: '每页条数必须为数字' })
  readonly limit?: number;
}

export class BaseFindByIdDto {
  @ApiProperty({ description: '主键 id', example: '' })
  @IsNotEmpty({ message: '主键 id 不能为空' })
  @IsUUID('all')
  readonly id: string;
}

export class BaseFindByPIdDto {
  @ApiPropertyOptional({ description: 'parentId', example: '' })
  readonly parentId: string;
}

