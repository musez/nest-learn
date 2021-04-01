import {
  Controller,
  Get,
  Post,
  Req,
  Request,
  Query,
  Body,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBasicAuth,
  ApiOperation,
} from '@nestjs/swagger';
import { OrgService } from './org.service';
import { CreateOrgDto } from './dto/create-org.dto';
import { UpdateOrgDto } from './dto/update-org.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurUser } from '../../common/decorators/user.decorator';
import { SearchOrgDto } from './dto/search-org.dto';
import { Org } from './entities/org.entity';
import { LimitOrgDto } from './dto/limit-org.dto';
import { BaseFindByIdDto, BaseFindByPIdDto } from '../base.dto';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';

@Controller('org')
@ApiTags('组织机构')
@ApiBasicAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class OrgController {
  constructor(private readonly orgService: OrgService) {
  }

  @Post('add')
  @Permissions('account:org:add')
  @ApiOperation({ summary: '添加' })
  async add(@CurUser() curUser, @Body() createOrgDto: CreateOrgDto) {
    return this.orgService.insert(createOrgDto, curUser);
  }

  @Get('findList')
  @Permissions('account:org:findList')
  @ApiOperation({ summary: '获取列表' })
  async findList(@Query() searchOrgDto: SearchOrgDto): Promise<Org[]> {
    return await this.orgService.selectList(searchOrgDto);
  }

  @Get('findListPage')
  @Permissions('account:org:findListPage')
  @ApiOperation({ summary: '获取列表（分页）' })
  async findListPage(@Query() limitOrgDto: LimitOrgDto): Promise<any> {
    return await this.orgService.selectListPage(limitOrgDto);
  }

  @Get('findTree')
  @Permissions('account:org:findTree')
  @ApiOperation({ summary: '获取树' })
  async findTree(@Query() baseFindByPIdDto: BaseFindByPIdDto): Promise<any> {
    return this.orgService.selectTree(baseFindByPIdDto);
  }

  @Get('findById')
  @Permissions('account:org:findById')
  @ApiOperation({ summary: '获取详情（主键 id）' })
  async findById(@Query() baseFindByIdDto: BaseFindByIdDto): Promise<Org> {
    return await this.orgService.selectById(baseFindByIdDto);
  }

  @Post('update')
  @Permissions('account:org:update')
  @ApiOperation({ summary: '修改' })
  async update(@CurUser() curUser, @Body() updateOrgDto: UpdateOrgDto): Promise<any> {
    let { id } = updateOrgDto;
    let isExistId = await this.orgService.isExistId(id);

    if (!isExistId) {
      throw new BadRequestException(`数据 id：${id} 不存在！`);
    }
    return this.orgService.update(updateOrgDto, curUser);
  }

  @Post('delete')
  @Permissions('account:org:delete')
  @ApiOperation({ summary: '删除' })
  async delete(@CurUser() curUser, @Body() baseFindByIdDto: BaseFindByIdDto): Promise<any> {
    let { id } = baseFindByIdDto;
    let isExistId = await this.orgService.isExistId(id);

    if (!isExistId) {
      throw new BadRequestException(`数据 id：${id} 不存在！`);
    }

    return await this.orgService.deleteById(baseFindByIdDto);
  }
}
