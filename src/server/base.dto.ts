import { IsNotEmpty, IsString, IsInt, IsEmail } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class BasePageDto {
  @ApiPropertyOptional({ description: '当前页数', example: 1 })
  // @IsInt({ message: '当前页数必须为数字' })
  readonly page?: string;

  @ApiPropertyOptional({ description: '每页条数', example: 10 })
  // @IsInt({ message: '每页条数必须为数字' })
  readonly limit?: string;
}

export class BaseFindByIdDto {
  @ApiProperty({ description: '主键 id', required: true, example: '' })
  @IsNotEmpty({ message: '主键 id 不能为空' })
  readonly id: string;
}

export class BaseFindByPIdDto {
  @ApiPropertyOptional({ description: 'parentId', example: '' })
  readonly parentId: string;
}

