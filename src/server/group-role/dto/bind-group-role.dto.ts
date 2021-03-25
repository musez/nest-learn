import { IsDefined, IsNotEmpty, IsString, IsInt, IsEmail, MinLength, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PickType, PartialType } from '@nestjs/swagger';
import { BaseFindByIdDto } from '../../base.dto';

export class BindGroupRoleDto extends PartialType(BaseFindByIdDto) {
  @ApiProperty({ description: '角色', example: [] })
  @IsDefined({ message: '角色不能为空！' })
  @IsNotEmpty({ message: '角色不能为空！' })
  readonly roles: string[];
}
