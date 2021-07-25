import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsInt, IsUUID } from 'class-validator';
import { LimitUserAddressDto } from './limit-user-address.dto';

export class SearchUserAddressDto extends PickType(LimitUserAddressDto, ['name', 'mobile']) {
}
