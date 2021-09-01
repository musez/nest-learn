import {
  Controller,
  Get,
  Render,
} from '@nestjs/common';
import { AppService } from './app.service';
import { Utils } from './utils';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {
  }

  @Get()
  @Render('index')
  index() {
    return {
      message: 'Hello nestjs !',
      time: Utils.now()
    };
  }

  @Get('hello')
  getHello(): string {
    return this.appService.getHello();
  }
}
