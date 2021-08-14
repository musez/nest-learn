import { IsDefined, IsOptional, IsNotEmpty, IsString, IsInt, MaxLength, IsUUID } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseConstants } from '../../../constants/constants';

export class BaseCommentDto {
  @ApiProperty({ description: '主键 id', example: null })
  @IsDefined({ message: '主键 id 不能为空！' })
  @IsNotEmpty({ message: '主键 id 不能为空！' })
  @IsUUID('all')
  readonly id: string;

  @ApiProperty({ description: '评论 id', example: null })
  @IsDefined({ message: '评论 id 不能为空！' })
  @IsNotEmpty({ message: '评论 id 不能为空！' })
  @IsUUID('all')
  readonly commentId: string;

  @ApiProperty({ description: '回复目标 id', example: null })
  @IsDefined({ message: '回复目标 id 不能为空！' })
  @IsNotEmpty({ message: '回复目标 id 不能为空！' })
  @IsUUID('all')
  readonly replyId: string;

  @ApiProperty({ description: '回复类型', default: 0 })
  @IsDefined({ message: '回复类型不能为空！' })
  @IsNotEmpty({ message: '回复类型不能为空！' })
  @Transform(value => Number.parseInt(value))
  @IsInt({ message: '回复类型为数字！' })
  readonly replyType: number;

  @ApiPropertyOptional({ description: '回复内容', example: null })
  readonly content?: string;

  @ApiProperty({ description: '回复用户 id', example: null })
  @IsDefined({ message: '回复用户 id 不能为空！' })
  @IsNotEmpty({ message: '回复用户 id 不能为空！' })
  @IsUUID('all')
  readonly fromUid: string;

  @ApiProperty({ description: '目标用户 id', example: null })
  @IsDefined({ message: '目标用户 id 不能为空！' })
  @IsNotEmpty({ message: '目标用户 id 不能为空！' })
  @IsUUID('all')
  readonly toUid: string;

  @ApiPropertyOptional({ description: '状态（0：禁用；1：启用）' })
  @IsOptional()
  @Transform(value => Number.parseInt(value))
  @IsInt({ message: '状态必须为数字！' })
  readonly status?: number;

  @ApiPropertyOptional({ description: '描述', example: null })
  @IsOptional()
  @MaxLength(BaseConstants.DESCRIPTION_MAX_LENGTH, { message: '描述不能大于 $constraint1 位！' })
  readonly description?: string;
}
