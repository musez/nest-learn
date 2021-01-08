import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsInt, IsUUID, MaxLength } from 'class-validator';
import { BasePageDto } from '../../base.dto';

export class LimitGroupDto extends PartialType(BasePageDto) {
  @ApiPropertyOptional({
    description: '名称',
  })
  @MaxLength(50, {
    message: '名称不能大于 50 位！',
  })
  readonly name: string;
}
