export const DatabaseConfig = {
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
  logging: false,
  cli: {
    migrationsDir: 'database/migration/default',
  },
}
