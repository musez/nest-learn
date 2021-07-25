import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { RedisModule } from 'nestjs-redis';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from '@hapi/joi';
import * as path from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './server/auth/auth.module';
import { UserModule } from './server/user/user.module';
import { UserinfoModule } from './server/userinfo/userinfo.module';
import { UserGroupModule } from './server/user-group/user-group.module';
import { GroupModule } from './server/group/group.module';
import { RoleModule } from './server/role/role.module';
import { GroupRoleModule } from './server/group-role/group-role.module';
import { PermissionModule } from './server/permission/permission.module';
import { RolePermissionModule } from './server/role-permission/role-permission.module';
import { DictModule } from './server/dict/dict.module';
import { DictItemModule } from './server/dict-item/dict-item.module';
import { AreaModule } from './server/area/area.module';
import { FileModule } from './server/file/file.module';
import { UserRoleModule } from './server/user-role/user-role.module';
import { ArticleModule } from './server/article/article.module';
import { CacheModule } from './server/cache/cache.module';
import { CaptchaModule } from './server/captcha/captcha.module';
import { ArticleCatModule } from './server/article-cat/article-cat.module';
import { ArticleDataCatModule } from './server/article-data-cat/article-data-cat.module';
import { OrgModule } from './server/org/org.module';
import { PostModule } from './server/post/post.module';
import { ExcelModule } from './server/excel/excel.module';
import { SystemController } from './server/system/system.controller';
import { SystemModule } from './server/system/system.module';
import { CodeGenerateModule } from './server/code-generate/code-generate.module';
import { HolidayModule } from './server/holiday/holiday.module';
import { WechatModule } from './server/wechat/wechat.module';
import { UserAddressModule } from './server/user-address/user-address.module';
import { TaskModule } from './server/task/task.module';
import AppConfig from './config/app.config';
import MysqlConfig from './config/mysql.config';
import RedisConfig from './config/redis.config';
import JwtConfig from './config/jwt.config';
import SwaggerConfig from './config/swagger.config';
import WechatConfig from './config/wechat.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.development'],
      isGlobal: true,
      // 配置为全局可见，否则需要在每个模块中单独导入 ConfigModule
      load: [AppConfig, JwtConfig, MysqlConfig, RedisConfig, SwaggerConfig, WechatConfig],
      // validationSchema: Joi.object({
      //   NODE_ENV: Joi.string()
      //     .valid('development', 'production', 'test', 'provision')
      //     .default('development'),
      // }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => {
        return Object.assign({
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          migrations: ['database/migration/**/*.ts'],
          cli: {
            migrationsDir: 'database/migration/default',
          },
        }, config.get('mysql'));
      },
      inject: [ConfigService],
    }),
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => configService.get('redis'),
      inject: [ConfigService],
    }),
    ScheduleModule.forRoot(),
    CacheModule,
    CaptchaModule,
    ExcelModule,
    AuthModule,
    UserModule,
    UserinfoModule,
    UserAddressModule,
    GroupModule,
    UserGroupModule,
    UserRoleModule,
    RoleModule,
    GroupRoleModule,
    PermissionModule,
    RolePermissionModule,
    OrgModule,
    PostModule,
    DictModule,
    DictItemModule,
    AreaModule,
    FileModule,
    ArticleModule,
    ArticleCatModule,
    ArticleDataCatModule,
    HolidayModule,
    WechatModule,
    TaskModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {
  constructor(private readonly connection: Connection) {
  }

  // configure(consumer: MiddlewareConsumer) {
  //   consumer
  //     .apply(LoggerMiddleware)
  //     .exclude({ path: 'hello', method: RequestMethod.GET })
  //     .forRoutes({ path: '*', method: RequestMethod.ALL });
  // }
}
