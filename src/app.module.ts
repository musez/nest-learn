import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { UserModule } from './server/user/user.module';
import { RoleModule } from './server/role/role.module';
import { PermissionModule } from './server/permission/permission.module';
import { FileModule } from './server/file/file.module';
import { GroupModule } from './server/group/group.module';
import { AuthModule } from './server/auth/auth.module';
import { UserinfoModule } from './server/userinfo/userinfo.module';
import { AreaModule } from './server/area/area.module';
import { DictModule } from './server/dict/dict.module';
import { DictItemModule } from './server/dict-item/dict-item.module';
import { RolePermissionRelationalModule } from './server/role-permission-relational/role-permission-relational.module';
import { UserGroupRelationalModule } from './server/user-group-relational/user-group-relational.module';
import { GroupRoleRelationalModule } from './server/group-role-relational/group-role-relational.module';

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
      synchronize: true, // 是否自动将实体类同步到数据库
      logging: true,
      cli: {
        migrationsDir: 'database/migration/default',
      },
    }),
    AuthModule,
    UserModule,
    UserinfoModule,
    GroupModule,
    RoleModule,
    PermissionModule,
    FileModule,
    AreaModule,
    DictModule,
    DictItemModule,
    RolePermissionRelationalModule,
    UserGroupRelationalModule,
    GroupRoleRelationalModule,
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
