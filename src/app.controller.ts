import { Controller, Get, Post, Request, UseGuards, Render } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {
  }

  @Get()
  @Render('index')
  index() {
    return { msg: 'Hello nestjs !' };
  }

  // getHello(): string {
  //   return this.appService.getHello();
  // }
}
