import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { RedisModule } from 'nestjs-redis';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
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

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'dmkj_wangyue',
      database: 'cms_nest',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      migrations: ['database/migration/**/*.ts'],
      // timezone: 'UTC',
      // charset: 'utf8mb4',
      multipleStatements: true,
      dropSchema: false,
      synchronize: false, // 是否自动将实体类同步到数据库
      logging: true,
      cli: {
        migrationsDir: 'database/migration/default',
      },
    }),
    RedisModule.register({
      port: 6379,
      host: '127.0.0.1',
      password: '',
      db: 0,
    }),
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
    ArticleModule,
    DictModule,
    DictItemModule,
    AreaModule,
    FileModule,
    CacheModule,
    CaptchaModule,
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
