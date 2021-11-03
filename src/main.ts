import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import * as express from 'express';
import { join } from 'path';
import * as helmet from 'helmet';
import * as rateLimit from 'express-rate-limit';
import * as compression from 'compression';
import * as figlet from 'figlet';
import { TransformInterceptor } from './common/interceptor/transform.interceptor';
import { ValidationPipe } from './common/pipe/validation.pipe';
import { HttpExceptionFilter } from './common/filter/http-exception.filter';
import { AllExceptionsFilter } from './common/filter/any-exception.filter';
import { logger } from './common/middleware/logger.middleware';
import { Logger } from './utils/log4js.util';
import { WsAdapter } from './server/ws/ws.adapter';
import { setupSwagger } from './swagger';

async function bootstrap() {
  // const app = await NestFactory.create(AppModule);
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true, // 设置跨站访问
    // logger: false,
  });
  // app.useWebSocketAdapter(new WsAdapter(app)); // 使用适配器

  const config = app.get(ConfigService);
  const listenPort = config.get('app.listenPort');
  const setupPath = config.get('swagger.setupPath');

  // 使用跨站脚本攻击类的库
  app.use(helmet({
    frameguard: false,  // 允许 iframe
  }));
  // 为了保护您的应用程序免受暴力攻击，您必须实现某种速率限制。幸运的是，NPM 上已经有很多各种中间件可用。其中一个是快速限额。
  app.use(rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  }));
  // 压缩，用于减少请求响应的体积
  app.use(compression());

  // 配置 public 文件夹为静态目录，以达到可直接访问下面文件的目的
  app.useStaticAssets(join(__dirname, '..', 'public'), {
    prefix: '/static/',
  });

  // 配置模板引擎
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('ejs');

  app.use(express.json()); // For parsing application/json
  app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded

  app.use(logger); // 监听所有的请求路由，并打印日志

  app.useGlobalFilters(new AllExceptionsFilter()); // 过滤处理所有异常
  app.useGlobalFilters(new HttpExceptionFilter()); // 过滤处理 HTTP 异常

  app.useGlobalInterceptors(new TransformInterceptor()); // 使用全局拦截器打印出参
  app.useGlobalPipes(new ValidationPipe()); // 开启一个全局验证管道
  // app.useGlobalPipes(new ParseIntPipe()); // 开启一个全局转换管道

  app.setGlobalPrefix('/api');
  setupSwagger(app);

  const server = await app.listen(listenPort, () => {
    // const host = server.address().address;
    // const port = server.address().port;

    figlet.text('icmz', {
      font: 'Small Slant',
      horizontalLayout: 'full',
      verticalLayout: 'default',
      width: 80,
      whitespaceBreak: false,
    }, function(err, data) {
      if (err) {
        return;
      }

      Logger.info(`${data} \n server listen on：http://localhost:${listenPort}/api \n swagger listen on：http://localhost:${listenPort}${setupPath} \n\n Powered by WangYue 2021`);
    });
  });

  // await app.listen(3001);
}

bootstrap();
