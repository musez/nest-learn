import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class BaseFileUploadDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  readonly file: any;

  @ApiPropertyOptional({ type: 'string', description: '文件显示名称' })
  readonly fileDisName: string;

  @ApiPropertyOptional({ type: 'string', description: '关联 id' })
  readonly extId: string;

  @ApiPropertyOptional({ type: 'string', description: '描述' })
  readonly description: string;
}

export class BaseFilesUploadDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  readonly files: any;

  @ApiPropertyOptional({ type: 'string', description: '文件显示名称' })
  readonly fileDisName: string;

  @ApiPropertyOptional({ type: 'string', description: '关联 id' })
  readonly extId: string;

  @ApiPropertyOptional({ type: 'string', description: '描述' })
  readonly description: string;
}
