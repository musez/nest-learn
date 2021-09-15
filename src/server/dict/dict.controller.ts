import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards, HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBasicAuth,
  ApiOperation,
} from '@nestjs/swagger';
import { DictService } from './dict.service';
import { CreateDictDto } from './dto/create-dict.dto';
import { UpdateDictDto } from './dto/update-dict.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Dict } from './entities/dict.entity';
import { BaseFindByIdDto, BaseFindByIdsDto, BaseModifyStatusByIdsDto } from '../base.dto';
import { CurUser } from '../../common/decorators/cur-user.decorator';
import { SearchDictDto } from './dto/search-dict.dto';
import { LimitDictDto } from './dto/limit-dict.dto';
import { DictItemService } from '../dict-item/dict-item.service';
import { Auth } from '../../common/decorators/auth.decorator';
import { AuthGuard } from '../../common/guards/auth.guard';
import { ApiException } from '../../common/exception/api-exception';
import { CreateDictItemDto } from '../dict-item/dto/create-dict-item.dto';
import { SearchDictItemDto } from '../dict-item/dto/search-dict-item.dto';
import { DictItem } from '../dict-item/entities/dict-item.entity';
import { LimitDictItemDto } from '../dict-item/dto/limit-dict-item.dto';
import { ApiErrorCode } from '../../constants/api-error-code.enum';

@ApiTags('字典')
@Controller('dict')
@ApiBasicAuth('token')
@UseGuards(JwtAuthGuard, AuthGuard)
export class DictController {
  constructor(
    private readonly dictService: DictService,
    private readonly dictItemService: DictItemService,
  ) {
  }

  @Post('add')
  @Auth('system:dict:add')
  @ApiOperation({ summary: '添加' })
  async create(@CurUser() curUser, @Body() createDictDto: CreateDictDto) {
    return await this.dictService.insert(createDictDto, curUser);
  }

  @Post('addItem')
  @Auth('system:dict:addItem')
  @ApiOperation({ summary: '添加字典项（批量）' })
  async createItems(@CurUser() curUser, @Body() createDictItemDto: CreateDictItemDto[]) {
    return await this.dictItemService.insertBatch(createDictItemDto, curUser);
  }

  @Get('findList')
  @Auth('system:dict:findList')
  @ApiOperation({ summary: '获取列表' })
  async findList(@Query() searchDictDto: SearchDictDto): Promise<Dict[]> {
    return await this.dictService.selectList(searchDictDto);
  }

  @Get('findItemList')
  @Auth('system:dict:findItemList')
  @ApiOperation({ summary: '获取字典项列表' })
  async findItemList(@Query() searchDictItemDto: SearchDictItemDto): Promise<DictItem[]> {
    return await this.dictItemService.selectList(searchDictItemDto);
  }

  @Get('findListPage')
  @Auth('system:dict:findListPage')
  @ApiOperation({ summary: '获取列表（分页）' })
  async findListPage(@Query() limitDictDto: LimitDictDto): Promise<any> {
    return await this.dictService.selectListPage(limitDictDto);
  }

  @Get('findItemListPage')
  @Auth('system:dict:findItemListPage')
  @ApiOperation({ summary: '获取字典项列表（分页）' })
  async findItemListPage(@Query() limitDictItemDto: LimitDictItemDto): Promise<any> {
    return await this.dictItemService.selectListPage(limitDictItemDto);
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
  async update(@CurUser() curUser, @Body() updateDictDto: UpdateDictDto): Promise<any> {
    try {
      const { id } = updateDictDto;
      const isExistId = await this.dictService.isExistId(id);

      if (!isExistId) {
        throw new ApiException(`数据 id：${id} 不存在！`, ApiErrorCode.NOT_FOUND, HttpStatus.OK);
      }

      return this.dictService.update(updateDictDto, curUser);
    } catch (e) {
      throw new ApiException(e.message, ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  @Post('updateStatus')
  @Auth('system:dict:updateStatus')
  @ApiOperation({ summary: '修改状态' })
  async updateStatus(@CurUser() curUser, @Body() baseModifyStatusByIdsDto: BaseModifyStatusByIdsDto): Promise<any> {
    return this.dictService.updateStatus(baseModifyStatusByIdsDto, curUser);
  }

  @Post('delete')
  @Auth('system:dict:delete')
  @ApiOperation({ summary: '删除' })
  async delete(@CurUser() curUser, @Body() baseFindByIdDto: BaseFindByIdDto): Promise<any> {
    try {
      const { id } = baseFindByIdDto;
      const isExistId = await this.dictService.isExistId(id);

      if (!isExistId) {
        throw new ApiException(`数据 id：${id} 不存在！`, ApiErrorCode.NOT_FOUND, HttpStatus.OK);
      }

      return await this.dictService.deleteById(baseFindByIdDto, curUser);
    } catch (e) {
      throw new ApiException(e.message, ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  @Post('deleteBatch')
  @Auth('system:dict:deleteBatch')
  @ApiOperation({ summary: '删除（批量）' })
  async deleteBatch(@CurUser() curUser, @Body() baseFindByIdsDto: BaseFindByIdsDto): Promise<any> {
    return await this.dictService.deleteByIds(baseFindByIdsDto, curUser);
  }

  @Get('findItemById')
  @Auth('system:dict:findItemById')
  @ApiOperation({ summary: '获取字典详情（主键 id）' })
  async findItemById(@Query() baseFindByIdDto: BaseFindByIdDto): Promise<any> {
    return await this.dictItemService.selectByDictId(baseFindByIdDto);
  }
}
