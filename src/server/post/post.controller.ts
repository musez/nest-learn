import { Controller, Get, Post, Query, Body, Put, Param, Delete, UseGuards, BadRequestException } from '@nestjs/common';
import {
  ApiTags,
  ApiBasicAuth,
  ApiOperation,
} from '@nestjs/swagger';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurUser } from '../../common/decorators/user.decorator';
import { LimitPostDto } from './dto/limit-post.dto';
import { SearchPostDto } from './dto/search-post.dto';
import { BaseFindByIdDto } from '../base.dto';
import { SysPost } from './entities/post.entity';

@Controller('post')
@ApiTags('岗位')
@ApiBasicAuth()
export class PostController {
  constructor(private readonly postService: PostService) {
  }

  @Post('add')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '添加' })
  async add(@CurUser() curUser, @Body() createPostDto: CreatePostDto) {
    return this.postService.insert(createPostDto, curUser);
  }

  @Get('findList')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '获取列表' })
  async findList(@Query() searchPostDto: SearchPostDto) {
    return await this.postService.selectList(searchPostDto);
  }

  @Get('findListPage')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '获取列表（分页）' })
  async findListPage(@Query() limitPostDto: LimitPostDto): Promise<any> {
    return await this.postService.selectListPage(limitPostDto);
  }

  @Get('findById')
  @ApiOperation({ summary: '获取详情（主键 id）' })
  @UseGuards(JwtAuthGuard)
  async findById(@Query() baseFindByIdDto: BaseFindByIdDto): Promise<SysPost> {
    return await this.postService.selectById(baseFindByIdDto);
  }

  @Post('update')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '修改' })
  async update(@CurUser() curUser, @Body() updatePostDto: UpdatePostDto): Promise<any> {
    let { id } = updatePostDto;
    let isExistId = await this.postService.isExistId(id);

    if (!isExistId) {
      throw new BadRequestException(`数据 id：${id} 不存在！`);
    }
    return this.postService.update(updatePostDto, curUser);
  }

  @Post('delete')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '删除' })
  async delete(@CurUser() curUser, @Body() baseFindByIdDto: BaseFindByIdDto): Promise<any> {
    let { id } = baseFindByIdDto;
    let isExistId = await this.postService.isExistId(id);

    if (!isExistId) {
      throw new BadRequestException(`数据 id：${id} 不存在！`);
    }
    return await this.postService.deleteById(baseFindByIdDto);
  }
}
