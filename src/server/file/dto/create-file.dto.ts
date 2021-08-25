import { ApiPropertyOptional } from '@nestjs/swagger';

export class CreateFileDto {
  @ApiPropertyOptional({ description: '文件类型（0：本地；1：七牛）', default: 0 })
  readonly type: number;

  @ApiPropertyOptional({ description: '云文件 key' })
  readonly key: string;

  @ApiPropertyOptional({ description: '文件原始名称' })
  readonly originalName: string;

  @ApiPropertyOptional({ description: '文件编码' })
  readonly encoding: string;

  @ApiPropertyOptional({ description: '文件类型' })
  readonly mimeType: string;

  @ApiPropertyOptional({ description: '文件目录' })
  readonly destination: string;

  @ApiPropertyOptional({ description: '文件名称' })
  readonly fileName: string;

  @ApiPropertyOptional({ description: '文件路径' })
  readonly path: string;

  @ApiPropertyOptional({ description: '文件大小' })
  readonly size: number;

  @ApiPropertyOptional({ description: '文件地址' })
  readonly fileUrl: string;

  @ApiPropertyOptional({ description: '文件显示名称' })
  readonly fileDisName: string;

  @ApiPropertyOptional({ description: '关联 id' })
  readonly extId: string;
}
