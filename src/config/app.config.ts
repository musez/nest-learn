import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  systemSuperUserId: '925a409c-ae39-4374-89b8-bd1297ef300e',
  systemSuperUserName: 'admin',
  systemSuperUserRealName: '超级管理员',
  listenPort: parseInt(process.env.SERVE_LISTEN_PORT, 10) || 3000,
}));
