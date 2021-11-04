import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Cron, Interval, Timeout } from '@nestjs/schedule';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { exec } from 'child_process';
import { ArticleService } from '../article/article.service';
import { CacheService } from '../cache/cache.service';
import { ArticlePrefix } from '../../constants/article.prefix';
import { logger } from '../../common/middleware/logger.middleware';
import { ArticleLinkService } from '../article-link/article-link.service';
import { ArticleCollectService } from '../article-collect/article-collect.service';
import { ApiException } from '../../common/exception/api-exception';
import { ApiErrorCode } from '../../constants/api-error-code.enum';
import { RedisUtil } from '../../utils/redis.util';
import * as _ from 'lodash';
import { UserService } from '../user/user.service';
import { ConfigService } from '@nestjs/config';
import { UserType } from '../../constants/dicts.enum';
import { UserPrefix } from '../../constants/user.prefix';
import { Utils } from '../../utils';

const cmdStr = 'sh ../../../bin/bash.sh';//这里面写你要执行的命令就行

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly cacheService: CacheService,
    private readonly userService: UserService,
    private readonly articleService: ArticleService,
    private readonly articleLinkService: ArticleLinkService,
    private readonly articleCollectService: ArticleCollectService,
  ) {
  }

  // * * * * * *
  // | | | | | |
  // | | | | | day of week
  // | | | | month
  // | | | day of month
  // | | hour
  // | minute
  // second (optional)

  // * * * * * *：每一秒
  // 45 * * * * *：每分钟，在45秒
  // * 10 * * * *：每小时一次，十分钟开始
  // 0 */30 9-17 * * *：上午九时至下午五时，每三十分钟一次
  // 0 30 11 * * 1-5：星期一至星期五上午11:30

  @Timeout(1000)
  async initSystemSuperUser() {
    // 启动服务时，自动初始化管理员账户
    try {
      const userId = this.configService.get('app.systemSuperUserId');
      const userName = this.configService.get('app.systemSuperUserName');
      const name = this.configService.get('app.systemSuperUserRealName');
      const ret = await this.userService.isExistId(userId);
      if (!ret) {
        const userRet = await this.userService.initSystemSuperUser({
          id: userId,
          userName: userName,
          userType: UserType.ADMIN,
          name: name,
        });
        if (userRet) {
          this.logger.log('启动服务，初始化管理员账户，初始化成功！');
        }
      } else {
        this.logger.log('启动服务，初始化管理员账户，已存在管理员账户！');
      }
    } catch (e) {
      this.logger.error('启动服务，初始化管理员账户，初始化异常：', e);
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  @Timeout(1000)
  async syncArticleInfoSQL2Redis() {
    // 启动服务时，同步数据至 redis
    try {
      this.logger.log('启动服务，syncArticleInfoSQL2Redis 开始同步... ...');
      const linkList = await this.articleLinkService.selectList();
      for (const v of linkList) {
        const { articleId, userId } = v;
        await this.cacheService.client.sadd(`${ArticlePrefix.ARTICLE_LINK}${articleId}`, userId);
      }

      const linkMap = _.groupBy(linkList, 'articleId');
      for (const [k, v] of Object.entries(linkMap)) {
        // @ts-ignore
        await this.cacheService.client.zadd(`${ArticlePrefix.ARTICLE_LINK_COUNT}`, v.length, k);
      }
      this.logger.log(`同步文章点赞流水 ${linkList.length} 条，同步文章点赞统计 ${Object.keys(linkMap).length} 条！`);

      const collectList = await this.articleCollectService.selectList();
      for (const v of collectList) {
        const { articleId, userId } = v;
        await this.cacheService.client.sadd(`${ArticlePrefix.ARTICLE_COLLECT}${articleId}`, userId);
      }

      const collectMap = _.groupBy(linkList, 'articleId');
      for (const [k, v] of Object.entries(collectMap)) {
        // @ts-ignore
        await this.cacheService.client.zadd(`${ArticlePrefix.ARTICLE_COLLECT_COUNT}`, v.length, k);
      }
      this.logger.log(`同步文章收藏流水 ${linkList.length} 条，同步文章收藏统计 ${Object.keys(collectMap).length} 条！`);

      const rank = await this.articleService.selectList({});
      for (const v of rank) {
        const { id, browseCount, linkCount, collectCount, shareCount, commentCount } = v;
        await this.cacheService.client.zadd(`${ArticlePrefix.ARTICLE_BROWSE_COUNT}`, browseCount, id);
        // await this.cacheService.client.zadd(`${ArticlePrefix.ARTICLE_LINK_COUNT}`, linkCount, id);
        // await this.cacheService.client.zadd(`${ArticlePrefix.ARTICLE_COLLECT_COUNT}`, collectCount, id);
        await this.cacheService.client.zadd(`${ArticlePrefix.ARTICLE_SHARE_COUNT}`, shareCount, id);
        // await this.cacheService.client.zadd(`${ArticlePrefix.ARTICLE_COMMENT_COUNT}`, commentCount, id);
      }
      this.logger.log(`启动服务，syncArticleInfoSQL2Redis 完成同步，同步文章浏览、分享统计 ${rank.length} 条！`);
    } catch (e) {
      this.logger.error('启动服务，syncArticleInfoSQL2Redis 完成同步，同步异常：', e);
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  @Interval(60000)
  async syncOnlineUser() {
    // 同步 redis 中的数据到 mysql
    try {
      this.logger.log('定时同步，syncOnlineUser 开始同步... ...');
      const userRet = await this.cacheService.client.zrevrangebyscore(`${UserPrefix.ONLINE_USER}`, '+inf', '-inf', 'withscores');
      const userMap = RedisUtil.arrayToMap(userRet);
      const expireUnix = Utils.valueOf() + 7200 * 1000;

      const ids = [...userMap.keys()].filter(v => {
        return userMap.get(v) > expireUnix;
      });
      for (const v of ids) {
        await this.cacheService.client.zrem(`${UserPrefix.ONLINE_USER}`, ids)
      }
      this.logger.log(`定时同步，syncOnlineUser 完成同步，共 ${userMap.size} 条，过期 ${ids.length} 条！`);
    } catch (e) {
      this.logger.error('定时同步，syncOnlineUser 完成同步，同步异常：', e);
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  @Interval(60000)
  async syncArticleInfoRedis2SQL() {
    // 同步 redis 中的数据到 mysql
    try {
      this.logger.log('定时同步，syncArticleInfoRedis2SQL 开始同步... ...');
      const linkRet = await this.cacheService.client.zrevrangebyscore(`${ArticlePrefix.ARTICLE_LINK_COUNT}`, '+inf', '-inf', 'withscores');
      const collectRet = await this.cacheService.client.zrevrangebyscore(`${ArticlePrefix.ARTICLE_COLLECT_COUNT}`, '+inf', '-inf', 'withscores');
      const linkMap = RedisUtil.arrayToMap(linkRet);
      const collectMap = RedisUtil.arrayToMap(collectRet);
      const linkIds = [...linkMap.keys()].map(v => v);
      const collectIds = [...collectMap.keys()].map(v => v);
      const ids = Array.from(new Set(linkIds.concat(collectIds)));// 取并集

      for (const v of ids) {
        await this.articleService.updateCount({
          id: v,
          linkCount: linkMap.has(v) ? linkMap.get(v) : undefined,
          collectCount: collectMap.has(v) ? collectMap.get(v) : undefined,
        });
      }
      this.logger.log(`定时同步，syncArticleInfoRedis2SQL 完成同步，同步文章点赞、收藏流水 ${ids.length} 条！`);
    } catch (e) {
      this.logger.error('定时同步，syncArticleInfoRedis2SQL 完成同步，同步异常：', e);
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  // @Cron('45 * * * * *')
  // handleMysqlBak() {
  //   // exec(cmdStr, (err, stdout, stderr) => {
  //     exec('mysqldump -uroot -pdmkj_root cms_nest > e:/bak/sql/mysql.sql', (err, stdout, stderr) => {
  //     // 将 mysql 执行命令作为参数输入
  //
  //     if (err) {
  //       console.log(err);
  //       return;
  //     }
  //     console.log('sync.....');
  //     console.log(`stdout: ${stdout}`);
  //     console.log(`stderr: ${stderr}`);
  //   });
  //   console.log('bak end');
  // }
}
