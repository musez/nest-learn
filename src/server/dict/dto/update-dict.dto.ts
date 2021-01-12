import { ApiProperty, PickType, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsInt, IsUUID } from 'class-validator';
import { UpdateDictItemDto } from '../../dict-item/dto/update-dict-item.dto';
import { BaseDictDto } from './base-dict.dto';

export class UpdateDictDto extends PickType(BaseDictDto,
  ['id', 'dictCode', 'dictName', 'status', 'description'],
) {
  @ApiPropertyOptional({ description: '字典项', example: [{ id: '', itemName: '', itemValue: '', sort: 0 }] })
  readonly dictItemList?: UpdateDictItemDto[];
}
