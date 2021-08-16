import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsInt, IsUUID } from 'class-validator';
import { LimitGroupDto } from './limit-group.dto';

export class SearchGroupDto extends PickType(LimitGroupDto, ['name', 'status']) {
}

