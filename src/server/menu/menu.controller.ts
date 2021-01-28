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
import { BaseFindByIdDto } from '../base.dto';
import { Menu } from './entities/menu.entity';
import { SearchMenuDto } from './dto/search-menu.dto';

@Controller('menu')
@ApiTags('菜单')
@ApiBasicAuth()
export class MenuController {
  constructor(private readonly menuService: MenuService) {
  }

  @Post('add')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '添加' })
  async add(@CurUser() curUser, @Body() createPermissionDto: CreateMenuDto) {
    return this.menuService.insert(createPermissionDto, curUser);
  }

  @Get('findList')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '获取列表' })
  findList(@CurUser() curUser, @Body() searchMenuDto: SearchMenuDto) {
    return this.menuService.selectList(searchMenuDto);
  }

  @Get('findListPage')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '获取列表（分页）' })
  findListPage(@CurUser() curUser, @Query() limitPermissionDto: LimitPermissionDto) {
    return this.menuService.selectListPage(limitPermissionDto);
  }

  @Get('findById')
  @ApiOperation({ summary: '获取详情（主键 id）' })
  @UseGuards(JwtAuthGuard)
  async findById(@CurUser() curUser, @Query() baseFindByIdDto: BaseFindByIdDto): Promise<Menu> {
    return await this.menuService.selectById(baseFindByIdDto);
  }

  @Post('modify')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '修改' })
  async modify(@CurUser() curUser, @Body() updateMenuDto: UpdateMenuDto): Promise<any> {
    return this.menuService.update(updateMenuDto, curUser);
  }
}
