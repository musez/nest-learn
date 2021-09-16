import {
  Controller,
  Get,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { QiniuService } from './qiniu.service';
import { ApiBasicAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { BaseQiniuDto } from './dto/base-qiniu.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthGuard } from '../../common/guards/auth.guard';
import { Auth } from '../../common/decorators/auth.decorator';
import { BaseFindByIdDto } from '../base.dto';

@ApiTags('七牛云文件')
@Controller('qiniu')
@ApiBasicAuth('token')
export class QiniuController {
  constructor(private readonly qiniuService: QiniuService) {
  }

  @Get('getToken')
  @UseGuards(JwtAuthGuard, AuthGuard)
  @Auth('system:qiniu:getToken')
  @ApiOperation({ summary: '获取 token' })
  async getToken() {
    return await this.qiniuService.createToken();
  }

  @Get('findById')
  @UseGuards(JwtAuthGuard, AuthGuard)
  @Auth('system:qiniu:findById')
  @ApiOperation({ summary: '文件信息' })
  async findById(@Query() baseFindByIdDto: BaseFindByIdDto) {
    return await this.qiniuService.selectById(baseFindByIdDto);
  }

  @Get('download')
  @ApiOperation({ summary: '下载' })
  async download(@Query() baseQiniuDto: BaseQiniuDto, @Res() res) {
    return await this.qiniuService.download(baseQiniuDto);
  }
}
