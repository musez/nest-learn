import { Controller, Get, Post, Body, Put, Param, Delete, Res, Req, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { WechatService } from './wechat.service';
import { CurUser } from '../../common/decorators/cur-user.decorator';
import { ConfigService } from '@nestjs/config';
import * as request from 'request';

@ApiTags('用户')
@Controller('wechat')
export class WechatController {
  constructor(
    private readonly config: ConfigService,
    private readonly wechatService: WechatService,
  ) {
  }

  @Get('getCode')
  @ApiOperation({ summary: '获取 code' })
  async getCode(@Res() res): Promise<any> {
    const appID = this.config.get('wechat.appID');

    const return_uri = 'http://127.0.0.1:3000/api/wechat/getAccessToken';
    const scoped = 'snsapi_userinfo';
    const state = '123';

    res.redirect('https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + appID + '&redirect_uri=' + return_uri + '&response_type=code&scope=' + scoped + '&state=' + state + '#wechat_redirect');
  }

  @Get('getAccessToken')
  @ApiOperation({ summary: '获取 access token' })
  async getAccessToken(@Query() query, @Req() req, @Res() res): Promise<any> {
    const code = query.code || '051oKwFa1KUVmB01FYHa1stBAv2oKwFM';
    const appID = this.config.get('wechat.appID');
    const appSecret = this.config.get('wechat.appSecret');

    // 请求获取令牌
    request.get({ url: 'https://api.weixin.qq.com/sns/oauth2/access_token?appid=' + appID + '&secret=' + appSecret + '&code=' + code + '&grant_type=authorization_code' },
      function(error, response, body) {
        console.log(response.statusCode, body);
        if (response.statusCode == 200) {
          const data = JSON.parse(body);
          const access_token = data.access_token;
          const openid = data.openid;

          // 调用获取用户信息的api
          request.get({ url: 'https://api.weixin.qq.com/sns/userinfo?access_token=' + access_token + '&openid=' + openid + '&lang=zh_CN' },
            function(error, response, body) {
              console.log(response.statusCode, body);

              const userinfo = JSON.parse(body);
              res.send('\
                            <h1>' + userinfo.nickname + ' 的个人信息</h1>\
                            <p><img src=\'' + userinfo.headimgurl + '\' /></p>\
                            <p>' + userinfo.city + '，' + userinfo.province + '，' + userinfo.country + '</p>\
                        ');
            });
        }
      });
  }
}
