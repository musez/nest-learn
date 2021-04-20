export default {
  type: 'mysql',
  host: process.env.MYSQL_HOST || 'localhost',
  port: parseInt(process.env.MYSQL_PORT, 10) || 3306,
  username: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  timezone: 'UTC',
  charset: 'utf8mb4',
  multipleStatements: true,
  dropSchema: false,
  synchronize: false, // 是否自动将实体类同步到数据库
  logging: false,
};
