import { Injectable } from '@nestjs/common';
import { RedisService } from 'nestjs-redis';
import { Logger } from '../../utils/log4js.util';

@Injectable()
export class CacheService {
  private client: any;

  constructor(private redisService: RedisService) {
    this.getClient()
      .then((res) => {
        Logger.log('redis 连接成功！');
      })
      .catch((error) => {
        Logger.error('redis 连接异常！异常信息：', error);
      });
  }

  public async getClient() {
    this.client = await this.redisService.getClient();
    return this.client
  }

  /**
   * @Description: 封装设置 redis 缓存的方法
   * @param key {String} - key值
   * @param value {String} - key的值
   * @param seconds {Number} - 过期时间
   * @return: Promise<any>
   */
  public async set(key: string, value: any, seconds?: number): Promise<any> {
    value = JSON.stringify(value);
    if (!this.client) {
      await this.getClient();
    }
    if (!seconds) {
      await this.client.set(key, value);
    } else {
      await this.client.set(key, value, 'EX', seconds);
    }
  }

  /**
   * @Description: 设置获取 redis 缓存中的值
   * @param key {String}
   */
  public async get(key: string): Promise<any> {
    if (!this.client) {
      await this.getClient();
    }

    const data = await this.client.get(key);

    if (data) {
      return JSON.parse(data);
    } else {
      return null;
    }
  }

  /**
   * @Description: 根据 key 删除 redis 缓存数据
   * @param key {String}
   * @return:
   */
  public async del(key: string): Promise<any> {
    if (!this.client) {
      await this.getClient();
    }

    await this.client.del(key);
  }

  /**
   * @Description: 清空 redis 的缓存
   * @param {type}
   * @return:
   */
  public async flushAll(): Promise<any> {
    if (!this.client) {
      await this.getClient();
    }

    await this.client.flushall();
  }
}
