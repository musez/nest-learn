import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './server/user/user.module';
import { StaffService } from './server/staff/staff.service';
import { StaffController } from './server/staff/staff.controller';
import { StaffModule } from './server/staff/staff.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { RoleModule } from './server/role/role.module';
import { PermissionModule } from './server/permission/permission.module';
import { FileModule } from './server/file/file.module';

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
      timezone: 'UTC',
      charset: 'utf8mb4',
      multipleStatements: true,
      dropSchema: false,
      synchronize: true, // 是否自动将实体类同步到数据库
      logging: true,
      cli: {
        migrationsDir: 'database/migration/default',
      },
    }),
    UserModule,
    StaffModule,
    PermissionModule,
    RoleModule,
    FileModule,
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
