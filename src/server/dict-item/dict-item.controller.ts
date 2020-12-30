import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiQuery,
  ApiBody,
  ApiBasicAuth,
  ApiOperation,
} from '@nestjs/swagger';
import { DictItemService } from './dict-item.service';
import { CreateDictItemDto } from './dto/create-dict-item.dto';
import { UpdateDictItemDto } from './dto/update-dict-item.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateDictDto } from '../dict/dto/create-dict.dto';

@ApiTags('字典')
@Controller('dict-item')
@ApiBasicAuth()
export class DictItemController {
  constructor(private readonly dictItemService: DictItemService) {
  }
}
