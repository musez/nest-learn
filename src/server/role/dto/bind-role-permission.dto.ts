import { IsNotEmpty, IsString, IsInt, IsEmail, MinLength, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PickType, PartialType } from '@nestjs/swagger';
import { BaseFindByIdDto } from '../../base.dto';

export class BindRolePermissionDto extends PartialType(BaseFindByIdDto) {
  @ApiProperty({ description: '权限', example: [] })
  readonly permissions: string[];
}
