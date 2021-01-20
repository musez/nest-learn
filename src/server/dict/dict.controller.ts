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
import { ParseIntPipe } from '../../common/pipe/parse-int.pipe';

@ApiTags('字典')
@Controller('dict')
@ApiBasicAuth()
export class DictController {
  constructor(private readonly dictService: DictService) {
  }

  @Post('add')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '添加' })
  async create(@Body() createDictDto: CreateDictDto) {
    let { dictItemList } = createDictDto;
    let dict = new Dict();

    for (let key in createDictDto) {
      if (!Utils.isEmpty(createDictDto[key])) {
        dict[key] = createDictDto[key];
      }
    }
    console.log(dictItemList);
    if (dictItemList) {
      for (const key in dictItemList) {
        let dictItem = new DictItem();

        for (const itemKey in dictItemList[key]) {
          if (dictItemList[key][itemKey]) {
            dictItem[itemKey] = dictItemList[key][itemKey];
          }
        }
        dictItem.dict = dict;
      }
    }
    let result = await this.dictService.insert(dict);

    return result;
  }

  @Get('findList')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '获取列表' })
  async findList(): Promise<Dict[]> {
    return await this.dictService.selectList();
  }

  @Get('findListPage')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '获取列表（分页）' })
  async findListPage(@Query() basePageDto: BasePageDto): Promise<any> {
    return await this.dictService.selectListPage(basePageDto);
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
  async modify(@Body() updateDictDto: UpdateDictDto): Promise<any> {
    return this.dictService.update(updateDictDto);
  }

  @Post('remove')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '删除' })
  async remove(@Body() baseFindByIdDto: BaseFindByIdDto): Promise<any> {
    return await this.dictService.deleteById(baseFindByIdDto);
  }
}
