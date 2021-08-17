import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiQuery,
  ApiBody,
  ApiBasicAuth,
  ApiOperation,
} from '@nestjs/swagger';
import { DictService } from './dict.service';
import { CreateDictDto } from './dto/create-dict.dto';
import { UpdateDictDto } from './dto/update-dict.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Dict } from './entities/dict.entity';
import { BaseFindByIdDto, BaseFindByIdsDto, BasePageDto } from '../base.dto';
import { CurUser } from '../../common/decorators/cur-user.decorator';
import { SearchDictDto } from './dto/search-dict.dto';
import { LimitDictDto } from './dto/limit-dict.dto';
import { DictItemService } from '../dict-item/dict-item.service';
import { Auth } from '../../common/decorators/auth.decorator';
import { AuthGuard } from '../../common/guards/auth.guard';
import { ApiException } from '../../common/exception/api-exception';

@ApiTags('字典')
@Controller('dict')
@ApiBasicAuth('token')
@UseGuards(JwtAuthGuard, AuthGuard)
export class DictController {
  constructor(
    private readonly dictService: DictService,
    private readonly dictItemService: DictItemService,
  ) {}

  @Post('add')
  @Auth('system:dict:add')
  @ApiOperation({ summary: '添加' })
  async create(@CurUser() curUser, @Body() createDictDto: CreateDictDto) {
    return await this.dictService.insert(createDictDto, curUser);
  }

  @Get('findList')
  @Auth('system:dict:findList')
  @ApiOperation({ summary: '获取列表' })
  async findList(@Query() searchDictDto: SearchDictDto): Promise<Dict[]> {
    return await this.dictService.selectList(searchDictDto);
  }

  @Get('findListPage')
  @Auth('system:dict:findListPage')
  @ApiOperation({ summary: '获取列表（分页）' })
  async findListPage(@Query() limitDictDto: LimitDictDto): Promise<any> {
    return await this.dictService.selectListPage(limitDictDto);
  }

  @Get('findById')
  @Auth('system:dict:findById')
  @ApiOperation({ summary: '获取详情（主键 id）' })
  async findById(@Query() baseFindByIdDto: BaseFindByIdDto): Promise<Dict> {
    return await this.dictService.selectById(baseFindByIdDto);
  }

  @Post('update')
  @Auth('system:dict:update')
  @ApiOperation({ summary: '修改' })
  async update(
    @CurUser() curUser,
    @Body() updateDictDto: UpdateDictDto,
  ): Promise<any> {
    const { id } = updateDictDto;
    const isExistId = await this.dictService.isExistId(id);

    if (!isExistId) {
      throw new ApiException(`数据 id：${id} 不存在！`, 404);
    }

    return this.dictService.update(updateDictDto, curUser);
  }

  @Post('delete')
  @Auth('system:dict:delete')
  @ApiOperation({ summary: '删除' })
  async delete(
    @CurUser() curUser,
    @Body() baseFindByIdDto: BaseFindByIdDto,
  ): Promise<any> {
    const { id } = baseFindByIdDto;
    const isExistId = await this.dictService.isExistId(id);

    if (!isExistId) {
      throw new ApiException(`数据 id：${id} 不存在！`, 404);
    }

    return await this.dictService.deleteById(baseFindByIdDto, curUser);
  }

  @Post('deleteBatch')
  @Auth('system:dict:deleteBatch')
  @ApiOperation({ summary: '删除（批量）' })
  async deleteBatch(
    @CurUser() curUser,
    @Body() baseFindByIdsDto: BaseFindByIdsDto,
  ): Promise<any> {
    return await this.dictService.deleteByIds(baseFindByIdsDto, curUser);
  }

  @Get('findDictItemById')
  @Auth('system:dict:findDictItemById')
  @ApiOperation({ summary: '获取字典详情（主键 id）' })
  async findDictItemById(
    @Query() baseFindByIdDto: BaseFindByIdDto,
  ): Promise<any> {
    return await this.dictItemService.selectByDictId(baseFindByIdDto);
  }
}
