import { Controller, Get, Post, Body, Put, Param, Delete, Query } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { CreateStatisticDto } from './dto/create-statistic.dto';
import { UpdateStatisticDto } from './dto/update-statistic.dto';
import { ApiBasicAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Auth } from '../../common/decorators/auth.decorator';

@Controller('statistics')
@ApiTags('统计')
@ApiBasicAuth('token')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {
  }

  @Get('findOnline')
  @Auth('cms:statistics:findOnline')
  @ApiOperation({ summary: '获取在线用户' })
  async findOnline(): Promise<any> {
    return this.statisticsService.selectOnline();
  }

  @Get('findArticleStatusCount')
  @Auth('cms:statistics:findArticleStatusCount')
  @ApiOperation({ summary: '获取新闻各个状态的数量' })
  async findArticleStatusCount(): Promise<any> {
    return this.statisticsService.selectArticleStatusCount();
  }

  @Get('findArticleRank')
  @Auth('cms:statistics:findArticleRank')
  @ApiOperation({ summary: '获取新闻' })
  async findArticleRank(): Promise<any> {
    return this.statisticsService.selectArticleRank();
  }
}
