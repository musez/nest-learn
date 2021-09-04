import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDefined, IsEmail, IsInt, IsMobilePhone, IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength, MinLength } from 'class-validator';
import { BaseConstants, UserConstants } from '../../../constants/swagger.const';

export class BaseFeedbackDto {
  @ApiProperty({ description: '主键 id', example: null })
  @IsDefined({ message: '主键 id 不能为空！' })
  @IsNotEmpty({ message: '主键 id 不能为空！' })
  @IsUUID('all')
  readonly id: string;

  @ApiPropertyOptional({ description: '姓名', example: '王' })
  @IsOptional()
  @IsString()
  @MinLength(UserConstants.NAME_MIN_LENGTH, {
    message: '姓名不能小于 $constraint1 位！',
  })
  @MaxLength(UserConstants.NAME_MAX_LENGTH, {
    message: '姓名不能大于 $constraint1 位！',
  })
  readonly name?: string;

  @ApiPropertyOptional({ description: '手机号', example: '15171111111' })
  @IsOptional()
  @IsMobilePhone('zh-CN')
  readonly mobile?: string;

  @ApiPropertyOptional({ description: '邮箱', example: '123@qq.com' })
  @IsOptional()
  @IsEmail()
  readonly email?: string;

  @ApiPropertyOptional({
    description: '建议反馈类型',
    example: 0,
  })
  @IsOptional()
  @Transform((value) => Number.parseInt(value))
  @IsInt({ message: '建议反馈类型必须为数字！' })
  readonly feedbackType?: number;

  @ApiPropertyOptional({
    description: '业务类型',
    example: 0,
  })
  @IsOptional()
  @Transform((value) => Number.parseInt(value))
  @IsInt({ message: '业务类型必须为数字！' })
  readonly businessType?: number;

  @ApiPropertyOptional({ description: '截图地址', example: null })
  @IsOptional()
  readonly screenshotId?: string;

  @ApiPropertyOptional({ description: '内容', example: null })
  readonly content?: string;

  @ApiProperty({ description: '状态（0：禁用；1：启用）', example: 0 })
  @IsDefined({ message: '状态不能为空！' })
  @IsNotEmpty({ message: '状态不能为空！' })
  @Transform((value) => Number.parseInt(value))
  @IsInt({ message: '状态必须为数字！' })
  readonly status?: number;

  @ApiPropertyOptional({ description: '描述', example: null })
  @IsOptional()
  @MaxLength(BaseConstants.DESCRIPTION_MAX_LENGTH, {
    message: '描述不能大于 $constraint1 位！',
  })
  readonly description?: string;
}