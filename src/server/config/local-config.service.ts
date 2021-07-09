import { Injectable } from '@nestjs/common';

import * as dotenv from 'dotenv';
import * as Joi from '@hapi/joi';
import * as fs from 'fs';

export interface EnvConfig {
  [key: string]: string;
}

@Injectable()
export class LocalConfigService {
  private readonly envConfig: EnvConfig;

  constructor(filePath: string) {
    const config = dotenv.parse(fs.readFileSync(filePath));
    console.log('filePath:',filePath);
    console.log('config:',config);
    this.envConfig = this.validateInput(config);
  }

  /**
   * 确保设置所有需要的变量，并返回经过验证的 JavaScript 对象
   * 包括应用的默认值。
   */
  private validateInput(envConfig: EnvConfig): EnvConfig {
    const envVarsSchema: Joi.ObjectSchema = Joi.object({
      // NODE_ENV: Joi.string().valid(['development', 'production', 'staging']).default('development'),
      // ENV: Joi.string().valid(['development', 'production', 'staging']).default('development'),

      NODE_ENV: Joi.string().default('development'),
      ENV: Joi.string().default('development'),

      SERVER_PORT: Joi.number().default(3000),

      MYSQL_HOST: Joi.string().default('localhost'),
      MYSQL_PORT: Joi.number().default(3306),
      MYSQL_USERNAME: Joi.string().default('root'),
      MYSQL_PASSWORD: Joi.string().required(),
      MYSQL_DATABASE: Joi.string().required(),

      REDIS_HOST: Joi.string().default('localhost'),
      REDIS_PORT: Joi.number().default(6379),
      REDIS_PASSWORD: Joi.string().default('root'),
      REDIS_DB: Joi.string().default('0'),

      JWT_SECRET_KEY: Joi.string().required(),
    });

    const { error, value: validatedEnvConfig } = envVarsSchema.validate(
      envConfig,
    );
    if (error) {
      throw new Error(`Config validation error: ${error.message}`);
    }
    return validatedEnvConfig;
  }

  // 传进來 key，回传 value
  get(key: string) {
    return this.envConfig[key];
  }

  get env(): string {
    return this.envConfig.ENV;
  }

  get serverPort(): number {
    return Number(this.envConfig.SERVER_PORT);
  }

  get mysqlHost(): string {
    return this.envConfig.MYSQL_HOST;
  }

  get mysqlPort(): number {
    return Number(this.envConfig.MYSQL_PORT);
  }

  get mysqlUsername(): string {
    return this.envConfig.MYSQL_USERNAME;
  }

  get mysqlPassword(): string {
    return this.envConfig.MYSQL_PASSWORD;
  }

  get mysqlDatabase(): string {
    return this.envConfig.MYSQL_DATABASE;
  }

  get redisHost(): string {
    return this.envConfig.REDIS_HOST;
  }

  get redisPort(): number {
    return Number(this.envConfig.REDIS_PORT);
  }

  get redisPassword(): string {
    return this.envConfig.REDIS_PASSWORD;
  }

  get redisDb(): string {
    return this.envConfig.REDIS_DB;
  }

  get jwtSecretKey(): string {
    return this.envConfig.JWT_SECRET_KEY;
  }
}
