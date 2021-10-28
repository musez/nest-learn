import { ApiProperty, ApiPropertyOptional, PartialType, PickType } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty } from 'class-validator';

export class DownloadImportLogDto {
  @ApiProperty({ description: '主键 id', example: null })
  @IsDefined({ message: '主键 id 不能为空！' })
  @IsNotEmpty({ message: '主键 id 不能为空！' })
  readonly id: string;

  @ApiProperty({ description: '导入模块', example: null })
  @IsDefined({ message: '导入模块不能为空！' })
  @IsNotEmpty({ message: '导入模块不能为空！' })
  readonly importType: string;
}
