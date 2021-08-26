import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  listenPort: parseInt(process.env.SERVE_LISTEN_PORT, 10) || 3000,
}));
