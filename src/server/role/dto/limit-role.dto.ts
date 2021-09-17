import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { BasePageDto } from '../../base.dto';

export class LimitRoleDto extends PartialType(BasePageDto) {
  @ApiPropertyOptional({ description: '名称' })
  readonly name?: string;

  @ApiPropertyOptional({ description: '状态（0：禁用；1：启用）', example: 1 })
   readonly status?: string;
}
