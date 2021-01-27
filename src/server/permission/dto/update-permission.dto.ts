import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsInt, IsUUID } from 'class-validator';
import { CreatePermissionDto } from './create-permission.dto';

export class UpdatePermissionDto extends PartialType(CreatePermissionDto) {
  @ApiProperty({ description: '主键 id', example: '' })
  @IsNotEmpty({ message: '主键 id 不能为空' })
  @IsUUID('all')
  readonly id: string;
}
