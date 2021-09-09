import { PartialType } from '@nestjs/mapped-types';
import { CreateImportLogDto } from './create-import-log.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty, IsUUID } from 'class-validator';

export class UpdateImportLogDto extends PartialType(CreateImportLogDto) {
  @ApiProperty({ description: '主键 id', example: null })
  @IsDefined({ message: '主键 id 不能为空！' })
  @IsNotEmpty({ message: '主键 id 不能为空！' })
  @IsUUID('all')
  readonly id: string;
}
