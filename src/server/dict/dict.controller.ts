import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiQuery,
  ApiBody,
  ApiBasicAuth,
  ApiOperation,
} from '@nestjs/swagger';
import { Utils } from './../../utils/index';
import { DictService } from './dict.service';
import { CreateDictDto } from './dto/create-dict.dto';
import { UpdateDictDto } from './dto/update-dict.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Dict } from './entities/dict.entity';
import { User } from '../user/entities/user.entity';
import { DictItem } from '../dict-item/entities/dict-item.entity';
import { BaseFindByIdDto, BasePageDto } from '../base.dto';
import { CurUser } from '../../common/decorators/user.decorator';
import { SearchDictDto } from './dto/search-dict.dto';
import { LimitDictDto } from './dto/limit-dict.dto';

@ApiTags('字典')
@Controller('dict')
@ApiBasicAuth()
export class DictController {
  constructor(private readonly dictService: DictService) {
  }

  @Post('add')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '添加' })
  async create(@CurUser() curUser, @Body() createDictDto: CreateDictDto) {
    return await this.dictService.insert(createDictDto, curUser);
  }

  @Get('findList')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '获取列表' })
  async findList(@Query() searchDictDto: SearchDictDto): Promise<Dict[]> {
    return await this.dictService.selectList(searchDictDto);
  }

  @Get('findListPage')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '获取列表（分页）' })
  async findListPage(@Query() limitDictDto: LimitDictDto): Promise<any> {
    return await this.dictService.selectListPage(limitDictDto);
  }

  @Get('findDictItemList')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '获取列表（字典项）' })
  async findDictItemList(): Promise<Dict[]> {
    return await this.dictService.selectDictItemList();
  }

  @Get('findDictItemListPage')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '获取列表（字典项）（分页）' })
  async findDictItemListPage(@Query() basePageDto: BasePageDto): Promise<any> {
    return await this.dictService.selectDictItemListPage(basePageDto);
  }

  @Get('findById')
  @ApiOperation({ summary: '获取详情（主键 id）' })
  @UseGuards(JwtAuthGuard)
  async findById(@Query() baseFindByIdDto: BaseFindByIdDto): Promise<Dict> {
    return await this.dictService.selectById(baseFindByIdDto);
  }

  @Post('modify')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '修改' })
  async modify(@CurUser() curUser, @Body() updateDictDto: UpdateDictDto): Promise<any> {
    return this.dictService.update(updateDictDto, curUser);
  }

  @Post('remove')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '删除' })
  async remove(@CurUser() curUser, @Body() baseFindByIdDto: BaseFindByIdDto): Promise<any> {
    return await this.dictService.deleteById(baseFindByIdDto);
  }
}
