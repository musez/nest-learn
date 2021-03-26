import { Controller, Get, Post, Body, Query, UseGuards, BadRequestException } from '@nestjs/common';
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
import { DictItemService } from '../dict-item/dict-item.service';

@ApiTags('字典')
@Controller('dict')
@ApiBasicAuth()
export class DictController {
  constructor(
    private readonly dictService: DictService,
    private readonly dictItemService: DictItemService,
  ) {
  }

  @Post('add')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '添加' })
  async create(@CurUser() curUser, @Body() createDictDto: CreateDictDto) {
    let { dictItems } = createDictDto;
    if (dictItems && dictItems.length > 0) {
      await this.dictItemService.insertBatch(dictItems, curUser);
    }
    delete createDictDto.dictItems;
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

  @Get('findById')
  @ApiOperation({ summary: '获取详情（主键 id）' })
  @UseGuards(JwtAuthGuard)
  async findById(@Query() baseFindByIdDto: BaseFindByIdDto): Promise<Dict> {
    return await this.dictService.selectById(baseFindByIdDto);
  }

  @Post('update')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '修改' })
  async update(@CurUser() curUser, @Body() updateDictDto: UpdateDictDto): Promise<any> {
    let { id, dictItems } = updateDictDto;
    let isExistId = await this.dictService.isExistId(id);

    if (!isExistId) {
      throw new BadRequestException(`数据 id：${id} 不存在！`);
    }

    if (dictItems && dictItems.length > 0) {
      await this.dictItemService.deleteByDictId(id);
      await this.dictItemService.insertBatch(dictItems, curUser);
    }
    delete updateDictDto.dictItems;
    return this.dictService.update(updateDictDto, curUser);
  }

  @Post('delete')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '删除' })
  async delete(@CurUser() curUser, @Body() baseFindByIdDto: BaseFindByIdDto): Promise<any> {
    let { id } = baseFindByIdDto;
    let isExistId = await this.dictService.isExistId(id);

    if (!isExistId) {
      throw new BadRequestException(`数据 id：${id} 不存在！`);
    }

    return await this.dictService.deleteById(baseFindByIdDto);
  }

  @Get('findDictItemById')
  @ApiOperation({ summary: '获取字典详情（主键 id）' })
  @UseGuards(JwtAuthGuard)
  async findDictItemById(@Query() baseFindByIdDto: BaseFindByIdDto): Promise<any> {
    return await this.dictItemService.selectByDictId(baseFindByIdDto);
  }
}
