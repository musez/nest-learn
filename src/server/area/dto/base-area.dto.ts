import {
  IsDefined,
  IsOptional,
  IsNotEmpty,
  IsInt,
  MaxLength,
  IsUUID,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class BaseAreaDto {
  @ApiProperty({ description: '主键 id', example: null })
  @IsDefined({ message: '主键 id 不能为空！' })
  @IsNotEmpty({ message: '主键 id 不能为空！' })
  readonly id: number;

  @ApiProperty({ description: '父 id', example: null })
  @IsDefined({ message: '父 id 不能为空！' })
  @IsNotEmpty({ message: '父 id 不能为空！' })
  readonly parentId: number;

  @ApiProperty({ description: '地区编码', example: null })
  @IsDefined({ message: '地区编码不能为空！' })
  @IsNotEmpty({ message: '地区编码不能为空！' })
  readonly areaCode: string;

  @ApiProperty({ description: '地区名称', example: null })
  @IsDefined({ message: '地区名称不能为空！' })
  @IsNotEmpty({ message: '地区名称不能为空！' })
  readonly areaName: string;

  @ApiPropertyOptional({
    description:
      '地区级别（1：省份 province；2：城市 city；3：区/县 district；4：街道/办 street）',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: '地区级别为数字！' })
  readonly level?: number;

  @ApiProperty({ description: '城市编码', example: null })
  @IsDefined({ message: '城市编码不能为空！' })
  @IsNotEmpty({ message: '城市编码不能为空！' })
  readonly cityCode: string;

  @ApiPropertyOptional({ description: '城市中心点', example: null })
  @IsOptional()
  readonly center?: string;

  @ApiPropertyOptional({ description: '经度坐标', example: null })
  @IsOptional()
  readonly long?: string;

  @ApiPropertyOptional({ description: '纬度坐标', example: null })
  @IsOptional()
  readonly lat?: string;
}
