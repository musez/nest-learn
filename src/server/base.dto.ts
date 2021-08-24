import {
  IsDefined,
  IsOptional,
  IsNotEmpty,
  IsInt,
  IsUUID,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class BasePageDto {
  @ApiPropertyOptional({ description: '当前页数', example: 1 })
  @IsOptional()
  @Transform((value) => Number.parseInt(value))
  // @Type(() => Number)
  @IsInt({ message: '当前页数必须为数字' })
  readonly page?: number;

  @ApiPropertyOptional({ description: '每页条数', example: 10 })
  @IsOptional()
  // @Type(() => Number)
  @Transform((value) => Number.parseInt(value))
  @IsInt({ message: '每页条数必须为数字' })
  readonly limit?: number;

  @ApiPropertyOptional({ description: '排序的方式: ASC, DESC' })
  readonly order: string;
}

export class BaseSearchDto {
  @ApiPropertyOptional({ description: '关键字', example: '王' })
  @IsOptional()
  readonly keyword?: string;
}

export class BaseModifyStatusByIdDto {
  @ApiProperty({ description: '主键 id', example: null })
  @IsDefined({ message: '主键 id 不能为空！' })
  @IsNotEmpty({ message: '主键 id 不能为空！' })
  readonly id: string;

  @ApiPropertyOptional({ description: '状态', example: 1 })
  @IsOptional()
  @Transform((value) => Number.parseInt(value))
  @IsInt({ message: '状态必须为数字！' })
  status?: number;
}

export class BaseModifyStatusByIdsDto {
  @ApiProperty({ description: '主键 ids', example: null })
  @IsDefined({ message: '主键 ids 不能为空！' })
  @IsNotEmpty({ message: '主键 ids 不能为空！' })
  readonly ids: string;

  @ApiPropertyOptional({ description: '状态', example: 1 })
  @IsOptional()
  @Transform((value) => Number.parseInt(value))
  @IsInt({ message: '状态必须为数字！' })
  status?: number;
}

export class BaseFindByIdDto {
  @ApiProperty({ description: '主键 id', example: null })
  @IsDefined({ message: '主键 id 不能为空！' })
  @IsNotEmpty({ message: '主键 id 不能为空！' })
  @IsUUID('all')
  readonly id: string;
}

export class BaseFindByIdsDto {
  @ApiProperty({ description: '主键 ids', example: null })
  @IsDefined({ message: '主键 ids 不能为空！' })
  @IsNotEmpty({ message: '主键 ids 不能为空' })
  readonly ids: string;
}

export class BaseFindByPIdDto {
  @ApiPropertyOptional({ description: 'parentId', example: null })
  readonly parentId: string;
}
