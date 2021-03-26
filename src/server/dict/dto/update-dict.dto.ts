import { ApiProperty, PickType, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsInt, IsUUID } from 'class-validator';
import { BaseDictDto } from './base-dict.dto';
import { CreateDictItemDto } from '../../dict-item/dto/create-dict-item.dto';

export class UpdateDictDto extends PickType(BaseDictDto,
  ['id', 'dictCode', 'dictName', 'status', 'description'],
) {
  @ApiPropertyOptional({ description: '字典项', example: [{ id: '', itemName: '', itemValue: '', sort: 0 }] })
  dictItems?: CreateDictItemDto[];
}
