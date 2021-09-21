import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty } from 'class-validator';

export class SearchDictCodeDto {
  @ApiProperty({ description: '字典编码，多个使用逗号“,”分隔', example: null })
  @IsDefined({ message: '字典编码不能为空！' })
  @IsNotEmpty({ message: '字典编码不能为空！' })
  readonly dictCode: string;
}