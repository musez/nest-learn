import { registerAs } from '@nestjs/config';

export default registerAs('wechat', () => ({
  appID: process.env.AppID,
  appSecret: process.env.AppSecret,
}));
