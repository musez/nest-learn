import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
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
import { User } from '../user/entities/user.entity';
import { DictItem } from '../dict-item/entities/dict-item.entity';

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
    let { dictItems } = createDictDto;
    let dict = new Dict();

    for (let key in createDictDto) {
      if (createDictDto[key] !== null && createDictDto[key] !== 0) {
        dict[key] = createDictDto[key];
      }
    }

    if (dictItems) {
      // let dictItemList = [];

      for (const key in dictItems) {
        let dictItem = new DictItem();

        for (const itemKey in dictItems[key]) {
          if (dictItems[key][itemKey]) {
            dictItem[itemKey] = dictItems[key][itemKey];
          }
        }
        dictItem.dict = dict;
        // dictItemList.push(dictItem);
      }

      // dict.dictItems = dictItemList;
    }
    console.log(JSON.stringify(dict));
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
  @ApiQuery({
    name: 'page',
    description: '第几页',
    required: false,
  })
  @ApiQuery({
    name: 'limit',
    description: '每页条数',
    required: false,
  })
  async findListPage(@Query() query): Promise<any> {
    return await this.dictService.selectListPage(query);
  }

  @Get('findById')
  @ApiOperation({ summary: '获取详情（主键 id）' })
  @UseGuards(JwtAuthGuard)
  async findById(@Query('id') id: string): Promise<Dict> {
    return await this.dictService.selectById(id);
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
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: '主键 id',
        },
      },
    },
  })
  async remove(@Body('id') id: string): Promise<any> {
    return await this.dictService.deleteById(id);
  }
}
