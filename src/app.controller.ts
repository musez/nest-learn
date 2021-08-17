import {
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
  Render,
} from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  index() {
    return { message: 'Hello nestjs !' };
  }

  @Get('hello')
  getHello(): string {
    return this.appService.getHello();
  }
}
