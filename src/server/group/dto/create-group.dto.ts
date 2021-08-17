import { IsNotEmpty, IsString, IsInt, IsEmail } from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger';
import { BaseGroupDto } from './base-group.dto';

export class CreateGroupDto extends PickType(BaseGroupDto, [
  'name',
  'status',
  'description',
]) {}
