import { registerAs } from '@nestjs/config';

export default registerAs('wechat', () => ({
  appID: process.env.WECHAT_APPID,
  appSecret: process.env.WECHAT_APPSECRET,
}));
