import {
  IsNotEmpty,
  IsString,
  IsInt,
  IsEmail,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UpdateUserDto } from '../../user/dto/update-user.dto';
import { UserConstants } from '../../../constants/constants';

export class BaseUserinfoDto {
  @ApiPropertyOptional({ description: '省份' })
  readonly provinceId?: number;

  @ApiPropertyOptional({ description: '城市' })
  readonly cityId?: number;

  @ApiPropertyOptional({ description: '区/县' })
  readonly districtId?: number;

  @ApiPropertyOptional({ description: '详细地址' })
  @MaxLength(UserConstants.ADDRESS_MAX_LENGTH, {
    message: '名称不能大于 $constraint1 位！',
  })
  readonly address?: string;

  @ApiPropertyOptional({ description: '用户' })
  readonly user?: UpdateUserDto;
}
