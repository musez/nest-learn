import { registerAs } from '@nestjs/config';

export default registerAs('swagger', () => ({
  setupPath: process.env.SWAGGER_SETUP_PATH || '/swagger',
  title: process.env.SWAGGER_UI_TITLE,
  desc: process.env.SWAGGER_UI_DESC,
  version: process.env.SWAGGER_API_VERSION,
  endpointPrefix: process.env.SWAGGER_ENDPOINT_PREFIX,
}));
