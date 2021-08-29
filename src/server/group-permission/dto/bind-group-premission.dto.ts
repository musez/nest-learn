import {
  ApiProperty,
  PartialType,
} from '@nestjs/swagger';
import { BaseFindByIdDto } from '../../base.dto';

export class BindGroupPermissionDto extends PartialType(BaseFindByIdDto) {
  @ApiProperty({ description: '权限', example: [] })
  readonly permissions: string[] | string;
}
