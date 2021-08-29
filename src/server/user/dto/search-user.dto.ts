import { PickType } from '@nestjs/swagger';
import { LimitUserDto } from './limit-user.dto';

export class SearchUserDto extends PickType(LimitUserDto, [
  'userName',
  'name',
  'userType',
  'mobile',
  'email',
  'status',
]) {}
