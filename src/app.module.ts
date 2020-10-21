import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './server/user/user.module';

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
      migrations: ['migration/*.ts'],
      timezone: 'UTC',
      charset: 'utf8mb4',
      multipleStatements: true,
      dropSchema: false,
      synchronize: true, // 是否自动将实体类同步到数据库
      logging: true,
    }),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {
  constructor (private readonly connection: Connection) {}
}
