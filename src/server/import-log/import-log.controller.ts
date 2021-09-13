import { Controller, Get, UseGuards, Query } from '@nestjs/common';
import { ImportLogService } from './import-log.service';
import { CreateImportLogDto } from './dto/create-import-log.dto';
import { UpdateImportLogDto } from './dto/update-import-log.dto';
import { ApiBasicAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthGuard } from '../../common/guards/auth.guard';
import { Auth } from '../../common/decorators/auth.decorator';
import { LimitImportLogDto } from './dto/limit-import-log.dto';
import { SearchImportLogDto } from './dto/search-import-log.dto';
import { ImportLog } from './entities/import-log.entity';

@Controller('importLog')
@ApiTags('导入日志')
@ApiBasicAuth('token')
@UseGuards(JwtAuthGuard, AuthGuard)
export class ImportLogController {
  constructor(private readonly importLogService: ImportLogService) {
  }

  @Get('findList')
  @Auth('system:importLog:findList')
  @ApiOperation({ summary: '获取列表' })
  async findList(@Query() searchImportLogDto: SearchImportLogDto): Promise<ImportLog[]> {
    return await this.importLogService.selectList(searchImportLogDto);
  }

  @Get('findListPage')
  @Auth('system:importLog:findListPage')
  @ApiOperation({ summary: '获取列表（分页）' })
  async findListPage(
    @Query() limitImportLogDto: LimitImportLogDto,
  ): Promise<any> {
    return await this.importLogService.selectListPage(limitImportLogDto);
  }
}
