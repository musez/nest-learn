import { IsDefined, IsOptional, IsNotEmpty, IsString, IsInt, MaxLength, IsUUID } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseConstants } from '../../../constants/constants';

export class BaseTopicDto {
  @ApiProperty({ description: '主键 id', example: null })
  @IsDefined({ message: '主键 id 不能为空！' })
  @IsNotEmpty({ message: '主键 id 不能为空！' })
  @IsUUID('all')
  readonly id: string;

  @ApiProperty({ description: '主题 id', example: null })
  @IsDefined({ message: '主题 id 不能为空！' })
  @IsNotEmpty({ message: '主题 id 不能为空！' })
  @IsUUID('all')
  readonly topicId: string;

  @ApiProperty({ description: '主题类型（0：新闻）', default: 0 })
  @IsDefined({ message: '主题类型不能为空！' })
  @IsNotEmpty({ message: '主题类型不能为空！' })
  @Transform(value => Number.parseInt(value))
  @IsInt({ message: '主题类型为数字！' })
  readonly topicType: number;

  @ApiPropertyOptional({ description: '评论内容', example: null })
  readonly content?: string;

  @ApiProperty({ description: '评论用户 id', example: null })
  @IsDefined({ message: '评论用户 id 不能为空！' })
  @IsNotEmpty({ message: '评论用户 id 不能为空！' })
  @IsUUID('all')
  readonly fromUid: string;

  @ApiProperty({ description: '状态（0：禁用；1：启用）', example: 0 })
  @IsDefined({ message: '状态不能为空！' })
  @IsNotEmpty({ message: '状态不能为空！' })
  @Transform(value => Number.parseInt(value))
  @IsInt({ message: '状态必须为数字！' })
  readonly status?: number;

  @ApiPropertyOptional({ description: '描述', example: null })
  @IsOptional()
  @MaxLength(BaseConstants.DESCRIPTION_MAX_LENGTH, { message: '描述不能大于 $constraint1 位！' })
  readonly description?: string;
}
