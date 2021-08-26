import { registerAs } from '@nestjs/config';

export default registerAs('qiniu', () => ({
  accessKey: process.env.QINIU_ACCESSKEY,
  secretKey: process.env.QINIU_SECRETKEY,
  bucket: process.env.QINIU_BUCKET,
  domain: process.env.QINIU_DOMAIN,
  expires: parseInt(process.env.QINIU_EXPIRES, 10) || 3600,
}));
