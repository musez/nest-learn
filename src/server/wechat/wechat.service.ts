import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class WechatService {
  private appId: string;
  private appSecret: string;

  constructor(private readonly config: ConfigService) {
    this.appId = this.config.get('wechat.appID');
    this.appSecret = this.config.get('wechat.appSecret');
  }
}
