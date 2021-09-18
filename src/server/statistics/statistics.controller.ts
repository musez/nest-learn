import { Controller, Get, Post, Body, Put, Param, Delete, Query } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { CreateStatisticDto } from './dto/create-statistic.dto';
import { UpdateStatisticDto } from './dto/update-statistic.dto';
import { ApiBasicAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Auth } from '../../common/decorators/auth.decorator';

@Controller('statistics')
@ApiTags('统计')
// @ApiBasicAuth('token')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {
  }

  @Get('findCount')
  @Auth('cms:statistics:findCount')
  @ApiOperation({ summary: '获取数量' })
  async findCount(): Promise<any> {
    return this.statisticsService.selectCount();
  }

  @Get('findArticle')
  @Auth('cms:statistics:findArticle')
  @ApiOperation({ summary: '获取新闻' })
  async findArticle(): Promise<any> {
    return this.statisticsService.selectArticle();
  }
}
