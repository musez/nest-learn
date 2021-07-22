import {
  IsDefined,
  ValidateIf,
  IsNotEmpty,
  IsString,
  IsInt,
  IsEmail,
  MinLength,
  MaxLength,
  IsMobilePhone,
  IsEnum,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseConstants, UserConstants } from '../../../constants/constants';

export class BaseHolidayDto {
  @ApiProperty({ description: '主键 id', example: null })
  @IsDefined({ message: '主键 id 不能为空！' })
  @IsNotEmpty({ message: '主键 id 不能为空！' })
  @IsUUID('all')
  readonly id: string;

  @ApiPropertyOptional({ description: '名称', example: '' })
  @IsOptional()
  @IsString()
  readonly name?: string;

  @ApiPropertyOptional({ description: '日期', example: '2020-12-25' })
  readonly date?: Date;

  @ApiPropertyOptional({ description: '周几（1：一；2：二；3：三；4：四；5：五；6：六；0：日）', example: 0 })
  @IsOptional()
  @Transform(value => Number.parseInt(value))
  @IsInt({ message: '周几必须为数字！' })
  readonly weekday?: number;

  @ApiPropertyOptional({ description: '类型（0：工作日；1：法定节假日；2：休息日加班；3：休息日）', example: 0 })
  @IsOptional()
  @Transform(value => Number.parseInt(value))
  @IsInt({ message: '上班类型必须为数字！' })
  readonly restType?: number;

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

export class BaseDaysDto {
  @ApiPropertyOptional({ description: '获取 n 天内的日期', example: 7 })
  @IsDefined({ message: 'n 不能为空！' })
  @IsNotEmpty({ message: 'n 不能为空' })
  @Transform(value => Number.parseInt(value))
  @IsInt({ message: 'n 必须为数字！' })
  readonly days?: number;
}
