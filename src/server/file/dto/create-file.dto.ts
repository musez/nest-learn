import { IsNotEmpty, IsString, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../entities/base.entity';

export class CreateFileDto extends BaseEntity{
  @ApiProperty({
    description: '文件原始名称',
    required: true,
  })
  readonly originalName: string;

  @ApiProperty({
    description: '文件编码',
    required: false,
  })
  readonly encoding: string;

  @ApiProperty({
    description: '文件类型',
    required: false,
  })
  readonly mimeType: string;

  @ApiProperty({
    description: '文件目录',
    required: false,
  })
  readonly destination: string;

  @ApiProperty({
    description: '文件名称',
    required: false,
  })
  readonly fileName: string;

  @ApiProperty({
    description: '文件路径',
    required: false,
  })
  readonly path: string;

  @ApiProperty({
    description: '文件大小',
    required: false,
  })
  readonly size: number;

  @ApiProperty({
    description: '文件地址',
    required: false,
  })
  readonly fileUrl: string;

  @ApiProperty({
    description: '关联 id',
    required: true,
  })
  readonly extId: string;
}
