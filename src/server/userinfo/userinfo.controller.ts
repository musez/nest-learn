import { Controller } from '@nestjs/common';
import { ApiTags, ApiBasicAuth } from '@nestjs/swagger';
import { UserinfoService } from './userinfo.service';
import { CreateUserinfoDto } from './dto/create-userinfo.dto';
import { UpdateUserinfoDto } from './dto/update-userinfo.dto';

@Controller('userinfo')
@ApiTags('用户信息')
@ApiBasicAuth('token')
export class UserinfoController {
  constructor(private readonly userinfoService: UserinfoService) {
  }
}
