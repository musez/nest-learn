import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsInt, IsUUID } from 'class-validator';
import { LimitMenuDto } from './limit-menu.dto';

export class SearchMenuDto extends PickType(LimitMenuDto,
  ['name', 'parentId'],
) {
}

