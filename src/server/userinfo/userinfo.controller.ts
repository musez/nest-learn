import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiQuery, ApiBody, ApiBasicAuth } from '@nestjs/swagger';
import { UserinfoService } from './userinfo.service';
import { CreateUserinfoDto } from './dto/create-userinfo.dto';
import { UpdateUserinfoDto } from './dto/update-userinfo.dto';

@Controller('userinfo')
@ApiTags('用户信息')
@ApiBasicAuth('token')
export class UserinfoController {
  constructor(private readonly userinfoService: UserinfoService) {}
}
