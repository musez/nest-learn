import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Put,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
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
import { CurUser } from '../../common/decorators/cur-user.decorator';
import { LimitDictItemDto } from '../dict-item/dto/limit-dict-item.dto';
import { SearchDictItemDto } from '../dict-item/dto/search-dict-item.dto';
import { DictItem } from './entities/dict-item.entity';
import { Auth } from '../../common/decorators/auth.decorator';
import { AuthGuard } from '../../common/guards/auth.guard';

@ApiTags('字典')
@Controller('dictItem')
@ApiBasicAuth('token')
@UseGuards(JwtAuthGuard, AuthGuard)
export class DictItemController {
  constructor(private readonly dictItemService: DictItemService) {}

  @Post('add')
  @Auth('system:dictItem:add')
  @ApiOperation({ summary: '添加' })
  async create(
    @CurUser() curUser,
    @Body() createDictItemDto: CreateDictItemDto,
  ) {
    return await this.dictItemService.insert(createDictItemDto, curUser);
  }

  @Post('addBatch')
  @Auth('system:dictItem:addBatch')
  @ApiOperation({ summary: '添加（批量）' })
  async createBatch(
    @CurUser() curUser,
    @Body() createDictItemDto: CreateDictItemDto[],
  ) {
    return await this.dictItemService.insertBatch(createDictItemDto, curUser);
  }

  @Get('findList')
  @Auth('system:dictItem:findList')
  @ApiOperation({ summary: '获取列表' })
  async findList(
    @Query() searchDictItemDto: SearchDictItemDto,
  ): Promise<DictItem[]> {
    return await this.dictItemService.selectList(searchDictItemDto);
  }

  @Get('findListPage')
  @Auth('system:dictItem:findListPage')
  @ApiOperation({ summary: '获取列表（分页）' })
  async findListPage(
    @Query() limitDictItemDto: LimitDictItemDto,
  ): Promise<any> {
    return await this.dictItemService.selectListPage(limitDictItemDto);
  }
}
