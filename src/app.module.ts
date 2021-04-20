import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { RedisModule } from 'nestjs-redis';
import { ConfigModule, ConfigService } from 'nestjs-config';
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

const ENV = process.env.NODE_ENV;

@Module({
  imports: [
    ConfigModule.load(path.resolve(__dirname, 'config/**/!(*.d).config.{ts,js}'), {
      // path: path.resolve(__dirname, '..', '.env.development'),
      path: path.resolve(__dirname, '..', !ENV ? '.env.development' : `.env.${ENV}`),
      modifyConfigName: name => name.replace('.config', ''),
    }),
    TypeOrmModule.forRootAsync({
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
      useFactory: (configService: ConfigService) => configService.get('redis'),
      inject: [ConfigService],
    }),
    CacheModule,
    CaptchaModule,
    ExcelModule,
    AuthModule,
    UserModule,
    UserinfoModule,
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
