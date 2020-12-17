import { Controller, Post, Request, UseGuards, Body } from '@nestjs/common';
import { ApiTags, ApiQuery, ApiBody, ApiParam, ApiHeader, ApiHeaders, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { User } from '../user/entities/user.entity';
import { LocalAuthGuard } from './guards/local-auth.guard';

@ApiTags('认证')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {
  }

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Request() request) {
    return this.authService.login(request.user);
  }
}
