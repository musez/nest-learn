import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { BasePageDto } from '../../base.dto';

export class LimitUserAddressDto extends PartialType(BasePageDto) {
  @ApiPropertyOptional({ description: '姓名' })
  readonly name?: string;

  @ApiPropertyOptional({ description: '手机号' })
  readonly mobile?: string;

  @ApiPropertyOptional({ description: '状态，多个使用逗号“,”分隔（0：禁用；1：启用）', example: 1 })
   readonly status?: string;
}
