import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  listenPort: process.env.SERVE_LISTEN_PORT,
}));
