import { registerAs } from '@nestjs/config';
import { DbLogger } from '../utils/log4js.util';

export default registerAs('mysql', () => ({
  type: 'mysql',
  host: process.env.MYSQL_HOST || 'localhost',
  port: parseInt(process.env.MYSQL_PORT, 10) || 3306,
  username: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  timezone: 'UTC',
  charset: 'utf8mb4',
  multipleStatements: false,
  dropSchema: false,
  synchronize: false, // 是否自动将实体类同步到数据库
  logging: true,
  "logger": new DbLogger(),	// 配置项添加自定义的log类
}));
