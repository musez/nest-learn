import { IsNotEmpty, IsString, IsInt, IsEmail, MinLength, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PickType, PartialType } from '@nestjs/swagger';
import { BaseFindByIdDto } from '../../base.dto';

export class BindGroupRoleDto extends PartialType(BaseFindByIdDto) {
  @ApiProperty({
    description: '角色',
    required: true,
    example: [{
      id: '',
    }],
  })
  readonly roles: BaseFindByIdDto[];
}
