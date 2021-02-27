import { Controller, Get, Post, Query, Body, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiQuery,
  ApiBody,
  ApiBasicAuth,
  ApiOperation,
} from '@nestjs/swagger';
import { MenuService } from './menu.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurUser } from '../../common/decorators/user.decorator';
import { LimitPermissionDto } from '../permission/dto/limit-permission.dto';
import { BaseFindByIdDto, BaseFindByPIdDto } from '../base.dto';
import { Menu } from './entities/menu.entity';
import { SearchMenuDto } from './dto/search-menu.dto';
import { LimitMenuDto } from './dto/limit-menu.dto';

@Controller('menu')
@ApiTags('菜单')
@ApiBasicAuth()
export class MenuController {
  constructor(private readonly menuService: MenuService) {
  }

  @Post('add')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '添加' })
  async add(@CurUser() curUser, @Body() createMenuDto: CreateMenuDto) {
    return this.menuService.insert(createMenuDto, curUser);
  }

  @Get('findList')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '获取列表' })
  async findList(@Query() searchMenuDto: SearchMenuDto) {
    return this.menuService.selectList(searchMenuDto);
  }

  @Get('findListPage')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '获取列表（分页）' })
  async findListPage(@Query() limitMenuDto: LimitMenuDto) {
    return this.menuService.selectListPage(limitMenuDto);
  }

  @Get('findTree')
  @ApiOperation({ summary: '获取树' })
  async findTree(@Query() baseFindByPIdDto: BaseFindByPIdDto): Promise<any> {
    return this.menuService.selectTree(baseFindByPIdDto);
  }

  @Get('findById')
  @ApiOperation({ summary: '获取详情（主键 id）' })
  @UseGuards(JwtAuthGuard)
  async findById(@Query() baseFindByIdDto: BaseFindByIdDto): Promise<Menu> {
    return await this.menuService.selectById(baseFindByIdDto);
  }

  @Post('modify')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '修改' })
  async modify(@CurUser() curUser, @Body() updateMenuDto: UpdateMenuDto): Promise<any> {
    return this.menuService.update(updateMenuDto, curUser);
  }

  @Post('remove')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '删除' })
  async remove(@CurUser() curUser, @Body() baseFindByIdDto: BaseFindByIdDto): Promise<any> {
    return await this.menuService.deleteById(baseFindByIdDto);
  }
}
