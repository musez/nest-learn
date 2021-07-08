import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import * as express from 'express';
import { join } from 'path';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';// api文档插件
// import * as passport from 'passport';
import * as session from 'express-session';
import { TransformInterceptor } from './common/interceptor/transform.interceptor';
import { ValidationPipe } from './common/pipe/validation.pipe';
import { ParseIntPipe } from './common/pipe/parse-int.pipe';
import { HttpExceptionFilter } from './common/filter/http-exception.filter';
import { AllExceptionsFilter } from './common/filter/any-exception.filter';
import { logger } from './common/middleware/logger.middleware';
import { Logger } from './utils/log4js';

async function bootstrap() {
  // const app = await NestFactory.create(AppModule);
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors();

  // app.use(session({
  //   secret: 'secret-key',
  //   name: 'sess-tutorial',
  //   resave: false,
  //   saveUninitialized: false,
  //   cookie:{
  //
  //   }
  // }))
  // app.use(passport.initialize());
  // app.use(passport.session());

  // 配置 public 文件夹为静态目录，以达到可直接访问下面文件的目的
  app.useStaticAssets('uploads', {
    prefix: '/uploads',
  });

  // 配置模板引擎
  app.setBaseViewsDir('views');
  app.setViewEngine('ejs');

  app.use(express.json()); // For parsing application/json
  app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded


  app.useGlobalFilters(new HttpExceptionFilter());// 过滤处理 HTTP 异常
  app.useGlobalFilters(new AllExceptionsFilter());// 过滤处理所有异常

  app.useGlobalInterceptors(new TransformInterceptor());// 使用全局拦截器打印出参
  app.useGlobalPipes(new ValidationPipe()); // 开启一个全局验证管道
  // app.useGlobalPipes(new ParseIntPipe()); // 开启一个全局转换管道

  app.use(logger);// 监听所有的请求路由，并打印日志

  app.setGlobalPrefix('/api');

  // DocumentBuilder 是一个辅助类，有助于结构的基本文件 SwaggerModule。它包含几种方法，可用于设置诸如标题，描述，版本等属性。
  const sysOptions = new DocumentBuilder()
    .setTitle('cms_nest 内容管理系统接口文档')
    .setDescription('后台管理系统接口文档') // 文档介绍
    .setVersion('1.0.0') // 文档版本
    .addServer('http://localhost:3000')
    .setExternalDoc('swagger.json', 'http://localhost:3000/api-docs-json')
    .setContact('Wang Yue', 'https://juejin.cn/user/1063982984593997', '920317438@qq.com')
    // .addTag('用户') // 每个 tag 标签都可以对应着几个 @ApiUseTags('用户') 然后被 ApiUseTags 注释，字符串一致的都会变成同一个标签下的
    // .setBasePath('http://localhost:5000')
    // .addBearerAuth({ type: 'apiKey', name: 'Authorization' })
    // .addBearerAuth()
    .addBasicAuth({ type: 'apiKey', in: 'header', name: 'token' })
    .build();

  // 为了创建完整的文档（具有定义的 HTTP 路由），我们使用类的 createDocument() 方法 SwaggerModule。此方法带有两个参数，分别是应用程序实例和基本 Swagger 选项。
  const sysDocument = SwaggerModule.createDocument(app, sysOptions);
  // 最后一步是 setup()。它依次接受（1）装入 Swagger 的路径，（2）应用程序实例, （3）描述 Nest 应用程序的文档。
  SwaggerModule.setup('/swagger', app, sysDocument, {
    swaggerOptions: {
      explorer: true,
      docExpansion: 'list',
      filter: true,
      showRequestDuration: true,
      syntaxHighlight: {
        active: true,
        theme: 'tomorrow-night',
      },
    },
  });

  await app.listen(3000);

  Logger.info(`
   _                   
  (_) ____  __ _    ___
 / / / __/ /  ' \\  /_ /
/_/  \\__/ /_/_/_/  /__/
`);

  Logger.info(`server listen on：http://localhost:3000/api\n swagger listen on：http://localhost:3000/swagger`);
}

bootstrap();
