import {
  ApiProperty,
  PartialType,
} from '@nestjs/swagger';
import { BaseFindByIdDto } from '../../base.dto';

export class BindUserRoleDto extends PartialType(BaseFindByIdDto) {
  @ApiProperty({ description: '角色', example: [] })
  readonly roles: string[] | string;
}
