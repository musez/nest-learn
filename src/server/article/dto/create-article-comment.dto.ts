import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsInt,
  IsUUID,
  IsDefined,
  IsOptional,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateArticleCommentDto {
  @ApiProperty({ description: '主键 id', example: null })
  @IsDefined({ message: '主键 id 不能为空！' })
  @IsNotEmpty({ message: '主键 id 不能为空！' })
  @IsUUID('all')
  readonly id: string;

  @ApiProperty({
    description: '评论类型（0：评论[topic]表；1；回复[comment]表）',
    example: null,
  })
  @IsDefined({ message: '评论类型不能为空！' })
  @IsNotEmpty({ message: '评论类型不能为空！' })
  @Transform((value) => Number.parseInt(value))
  @IsInt({ message: '评论类型为数字！' })
  readonly type: number;

  @ApiPropertyOptional({
    description: '回复类型（0：评论；1；回复）',
    default: 0,
  })
  @IsOptional()
  @Transform((value) => Number.parseInt(value))
  @IsInt({ message: '回复类型为数字！' })
  readonly replyType?: number;

  @ApiPropertyOptional({
    description:
      '回复目标 id（回复类型为评论时，为评论[topic]表 id；为回复时，为回复[comment]表 id）',
    example: null,
  })
  @IsOptional()
  @IsUUID('all')
  readonly replyId?: string;

  @ApiPropertyOptional({ description: '评论内容', example: null })
  readonly content?: string;

  @ApiProperty({ description: '目标用户 id', example: null })
  @IsDefined({ message: '目标用户 id 不能为空！' })
  @IsNotEmpty({ message: '目标用户 id 不能为空！' })
  @IsUUID('all')
  readonly toUid: string;
}
