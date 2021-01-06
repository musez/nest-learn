import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsInt, IsUUID } from 'class-validator';
import { BasePageDto } from '../../base.dto';

export class LimitUserGroupDto extends PartialType(BasePageDto) {
  @ApiPropertyOptional({
    description: '名称',
  })
  readonly name: string;
}
