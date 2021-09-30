import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

export const setupSwagger = (app: INestApplication) => {
  const config = app.get(ConfigService);
  const listenPort = config.get('app.listenPort');
  const setupPath = config.get('swagger.setupPath');

  // DocumentBuilder 是一个辅助类，有助于结构的基本文件 SwaggerModule。它包含几种方法，可用于设置诸如标题，描述，版本等属性。
  const sysOptions = new DocumentBuilder()
    .setTitle(config.get('app.title'))
    .setDescription(config.get('app.desc')) // 文档介绍
    .setVersion(config.get('app.version')) // 文档版本
    .addServer(`http://localhost:${listenPort}`)
    .setExternalDoc(
      'swagger.json',
      `http://localhost:${listenPort}${setupPath}-json`,
    )
    .setContact(
      'Wang Yue',
      'https://juejin.cn/user/1063982984593997',
      '920317438@qq.com',
    )
    // .addBearerAuth({ type: 'apiKey', name: 'Authorization' })
    // .addBasicAuth({ type: 'apiKey', in: 'header', name: 'token' })
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'token',
    )
    .build();

  // 为了创建完整的文档（具有定义的 HTTP 路由），我们使用类的 createDocument() 方法 SwaggerModule。此方法带有两个参数，分别是应用程序实例和基本 Swagger 选项。
  const sysDocument = SwaggerModule.createDocument(app, sysOptions);
  // 最后一步是 setup()。它依次接受（1）装入 Swagger 的路径，（2）应用程序实例, （3）描述 Nest 应用程序的文档。
  SwaggerModule.setup(setupPath, app, sysDocument);
};
