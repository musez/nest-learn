import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Utils } from './../../utils/index';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { BaseFindByIdDto, BaseFindByIdsDto, BaseModifyStatusByIdsDto } from '../base.dto';
import { Article } from './entities/article.entity';
import { SearchArticleDto } from './dto/search-article.dto';
import { LimitArticleDto } from './dto/limit-article.dto';
import { ArticleDataCat } from '../article-data-cat/entities/article-data-cat.entity';
import { ArticleCat } from '../article-cat/entities/article-cat.entity';
import { ArticleCatService } from '../article-cat/article-cat.service';
import { ArticleDataCatService } from '../article-data-cat/article-data-cat.service';
import { ApiException } from '../../common/exception/api-exception';
import { TopicService } from '../topic/topic.service';
import { CommentService } from '../comment/comment.service';
import { LimitArticleTopDto } from './dto/limit-article-topic.dto';
import { CreateArticleCommentDto } from './dto/create-article-comment.dto';
import { ArticlePrefix } from '../../constants/article.prefix';
import { CacheService } from '../cache/cache.service';
import { TopicType } from '../../constants/dicts.enum';
import { ApiErrorCode } from '../../constants/api-error-code.enum';
import { ArticleLinkService } from '../article-link/article-link.service';
import { ArticleCollectService } from '../article-collect/article-collect.service';
import { RedisUtil } from '../../utils/redis.util';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
    private readonly articleCatService: ArticleCatService,
    private readonly articleDataCatService: ArticleDataCatService,
    private readonly articleLinkService: ArticleLinkService,
    private readonly articleCollectService: ArticleCollectService,
    private readonly topicService: TopicService,
    private readonly commentService: CommentService,
    private readonly cacheService: CacheService,
  ) {
  }

  /**
   * 添加
   */
  async insert(createArticleDto: CreateArticleDto, curUser?): Promise<any> {
    try {
      const { cats } = createArticleDto;

      let article = new Article();
      article = Utils.dto2entity(createArticleDto, article);
      if (curUser) {
        article.createBy = curUser!.id;
      }

      const ret = await this.articleRepository.save(article);
      if (!ret) {
        throw new ApiException('操作异常！', ApiErrorCode.ERROR, HttpStatus.OK);
      }
      return await this.bindArticleCats(ret.id, cats);
    } catch (e) {
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  /**
   * 获取列表
   */
  async selectList(searchArticleDto: SearchArticleDto): Promise<any[]> {
    try {
      // eslint-disable-next-line prefer-const
      let { title, type, status, catId } = searchArticleDto;

      const queryConditionList = [];
      if (!Utils.isBlank(title)) {
        queryConditionList.push('title LIKE :title');
      }
      if (!Utils.isBlank(type)) {
        queryConditionList.push('type = :type');
      }
      if (!Utils.isBlank(status)) {
        if (!Utils.isArray(status)) {
          // @ts-ignore
          status = Utils.split(status.toString());
        }
        queryConditionList.push('status IN (:status)');
      }
      if (!Utils.isBlank(catId)) {
        queryConditionList.push('articleDataCats.articleId = article.id');
        queryConditionList.push('articleDataCats.catId = :catId');
      }
      queryConditionList.push('deleteStatus = 0');
      const queryCondition = queryConditionList.join(' AND ');

      const ret = await this.articleRepository
        .createQueryBuilder()
        .where(queryCondition, {
          title: `%${title}%`,
          type: type,
          status: status,
          catId: catId,
        })
        .orderBy({
          status: 'DESC',
          createTime: 'DESC',
        })
        .getMany();

      for (let item of ret) {
        const { id } = item;

        const retRel = await this.articleRepository
          .createQueryBuilder('article')
          .innerJoinAndSelect(ArticleDataCat, 'adc', 'article.id = adc.articleId')
          .innerJoinAndSelect(ArticleCat, 'ac', 'ac.id = adc.catId')
          .select('ac.id', 'ac.catName')
          .where('article.id = :id', {
            id: id,
          })
          .getMany();

        item = Object.assign(item, {
          cats: retRel,
        });
      }

      return ret;
    } catch (e) {
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  /**
   * 获取列表（分页）
   */
  async selectListPage(limitArticleDto: LimitArticleDto): Promise<any> {
    try {
      // eslint-disable-next-line prefer-const
      let { page, limit, title, type, status, catId } = limitArticleDto;
      page = page ? page : 1;
      limit = limit ? limit : 10;
      const offset = (page - 1) * limit;

      const queryConditionList = [];
      if (!Utils.isBlank(title)) {
        queryConditionList.push('article.title LIKE :title');
      }
      if (!Utils.isBlank(type)) {
        queryConditionList.push('article.type = :type');
      }
      if (!Utils.isBlank(status)) {
        if (!Utils.isArray(status)) {
          // @ts-ignore
          status = Utils.split(status.toString());
        }
        queryConditionList.push('status IN (:status)');
      }
      if (!Utils.isBlank(catId)) {
        queryConditionList.push('articleDataCats.articleId = article.id');
        queryConditionList.push('articleDataCats.catId = :catId');
      }
      queryConditionList.push('article.deleteStatus = 0');
      const queryCondition = queryConditionList.join(' AND ');

      const ret = await this.articleRepository
        .createQueryBuilder('article')
        .innerJoinAndSelect('article.articleDataCats', 'articleDataCats')
        .where(queryCondition, {
          title: `%${title}%`,
          type: type,
          status: status,
          catId: catId,
        })
        .skip(offset)
        .take(limit)
        .orderBy({
          'article.status': 'DESC',
          'article.createTime': 'DESC',
        })
        .getManyAndCount();

      for (const item of ret[0]) {
        const { articleDataCats } = item;
        if (articleDataCats?.length > 0) {
          const ids = articleDataCats.map((v) => v.id);
          const articleDataCatRel = await this.articleDataCatService.selectByIds(ids);

          const cats = articleDataCatRel.filter(v => v.cat).map((v) => v.cat);
          item['cats'] = cats;
        } else {
          item['cats'] = [];
        }
      }

      return {
        list: ret[0],
        total: ret[1],
        page: page,
        limit: limit,
      };
    } catch (e) {
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  /**
   * 获取数量
   */
  async selectStatusCount(): Promise<any> {
    try {
      const ret = await this.selectList({});
      const disable = ret.filter(v => v.status === 0);
      const enable = ret.filter(v => v.status === 1);
      const draft = ret.filter(v => v.status === 2);
      const recycle = ret.filter(v => v.status === 3);

      return {
        total: ret.length,
        disable: disable.length,
        enable: enable.length,
        draft: draft.length,
        recycle: recycle.length,
      };

      // const [retTotal, retDisable, retEnable, retDraft, retRecycle] = await Promise.all([
      //   this.articleRepository.count(),
      //   this.articleRepository.count({ status: 0 }),
      //   this.articleRepository.count({ status: 1 }),
      //   this.articleRepository.count({ status: 2 }),
      //   this.articleRepository.count({ status: 3 }),
      // ]);
      //
      // if (retTotal && retDisable && retEnable && retDraft && retRecycle) {
      //   return {
      //     total: retTotal,
      //     disable: retDisable,
      //     enable: retEnable,
      //     draft: retDraft,
      //     recycle: retRecycle,
      //   };
      // } else {
      //   throw new ApiException('获取异常！', ApiErrorCode.ERROR, HttpStatus.OK);
      // }
    } catch (e) {
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  /**
   * 获取详情（关联信息，主键 id）
   */
  async selectInfoById(baseFindByIdDto: BaseFindByIdDto): Promise<Article> {
    try {
      const { id } = baseFindByIdDto;
      const ret = await this.articleRepository.findOne({
        relations: ['articleDataCats'],
        where: {
          id: id,
        },
      });
      if (!ret) {
        throw new ApiException(`数据 id：${id} 不存在！`, ApiErrorCode.NOT_FOUND, HttpStatus.OK);
      }
      if (ret?.articleDataCats?.length > 0) {
        const ids = ret.articleDataCats.map((v) => v.id);
        const articleDataCatRet = await this.articleDataCatService.selectByIds(ids);

        ret['cats'] = articleDataCatRet.map((v) => v.cat);
      } else {
        ret['cats'] = [];
      }

      return ret;
    } catch (e) {
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  /**
   * 获取详情（主键 id）
   */
  async selectById(baseFindByIdDto: BaseFindByIdDto): Promise<Article> {
    try {
      const { id } = baseFindByIdDto;
      const ret = await this.articleRepository.findOne({
        where: {
          id: id,
        },
      });
      if (!ret) {
        throw new ApiException(`数据 id：${id} 不存在！`, ApiErrorCode.NOT_FOUND, HttpStatus.OK);
      }
      return ret;
    } catch (e) {
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  /**
   * 获取详情（主键 ids）
   */
  async selectByIds(ids: string[]): Promise<Article> {
    try {
      const ret = await this.articleRepository.findOne({
        where: {
          id: In(ids),
        },
      });
      return ret;
    } catch (e) {
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  /**
   * 是否存在（主键 id）
   */
  async isExistId(id: string): Promise<boolean> {
    try {
      const isExist = await this.articleRepository.findOne(id);
      if (Utils.isNil(isExist)) {
        return false;
      } else {
        return true;
      }
    } catch (e) {
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  /**
   * 修改
   */
  async update(updateArticleDto: UpdateArticleDto, curUser?): Promise<any> {
    try {
      const { id, cats, status } = updateArticleDto;

      let article = new Article();
      article = Utils.dto2entity(updateArticleDto, article);

      if (status === 1) {
        // @ts-ignore
        article.publishTime = Utils.now();
        article.publishBy = curUser ? curUser!.id : null;
      } else {
        article.publishTime = null;
        article.publishBy = null;
      }

      const ret = await this.articleRepository.update(id, article);
      if (!ret) {
        throw new ApiException('操作异常！', ApiErrorCode.ERROR, HttpStatus.OK);
      }

      if (cats) {
        return await this.bindArticleCats(id, cats);
      } else {
        return ret;
      }
    } catch (e) {
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  /**
   * 修改状态
   */
  async updateStatus(baseModifyStatusByIdsDto: BaseModifyStatusByIdsDto, curUser?): Promise<void> {
    try {
      // eslint-disable-next-line prefer-const
      let { ids, status } = baseModifyStatusByIdsDto;
      if (!Utils.isArray(ids)) {
        ids = Utils.split(ids.toString());
      }

      let publishTime = null, publishBy = null;
      if (status === 1) {
        publishTime = Utils.now();
        publishBy = curUser ? curUser!.id : null;
      } else {
        publishTime = null;
        publishBy = null;
      }

      await this.articleRepository
        .createQueryBuilder()
        .update(Article)
        .set({
          status: status,
          updateBy: curUser ? curUser!.id : null,
          publishTime: publishTime,
          publishBy: publishBy,
        })
        .where('id IN (:ids)', { ids: ids })
        .execute();
    } catch (e) {
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  /**
   * 修改浏览数、点赞数、收藏数、分享数、浏览数
   */
  async updateCount(updateArticleDto: UpdateArticleDto, curUser?): Promise<any> {
    try {
      const { id } = updateArticleDto;

      let article = new Article();
      article = Utils.dto2entity(updateArticleDto, article);
      const ret = await this.articleRepository.update(id, article);
      if (!ret) {
        throw new ApiException('操作异常！', ApiErrorCode.ERROR, HttpStatus.OK);
      }
      return ret;
    } catch (e) {
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  /**
   * 回收站删除
   */
  async deleteById(baseFindByIdDto: BaseFindByIdDto, curUser?): Promise<void> {
    try {
      const { id } = baseFindByIdDto;

      await this.articleRepository
        .createQueryBuilder()
        .update(Article)
        .set({ deleteStatus: 1, deleteBy: curUser ? curUser!.id : null, deleteTime: Utils.now() })
        .where('id = :id', { id: id })
        .execute();
    } catch (e) {
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  /**
   * 回收站删除（批量）
   */
  async deleteByIds(baseFindByIdsDto: BaseFindByIdsDto, curUser?): Promise<void> {
    try {
      let { ids } = baseFindByIdsDto;

      if (!Utils.isArray(ids)) {
        ids = Utils.split(ids.toString());
      }
      await this.articleRepository
        .createQueryBuilder()
        .update(Article)
        .set({ deleteStatus: 1, deleteBy: curUser ? curUser!.id : null, deleteTime: Utils.now() })
        .where('id IN (:ids)', { ids: ids })
        .execute();
    } catch (e) {
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  /**
   * 回收站清空
   */
  async deleteAll(curUser?): Promise<void> {
    try {
      await this.articleRepository
        .createQueryBuilder()
        .update(Article)
        .set({ deleteStatus: 1, deleteBy: curUser ? curUser!.id : null, deleteTime: Utils.now() })
        .where('status = 3')
        .execute();
    } catch (e) {
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  /**
   * 绑定栏目
   */
  async bindArticleCats(id: string, cats: string): Promise<void> {
    try {
      const articleCats = Utils.split(cats);

      const articleRet = await this.articleRepository.findOne({
        where: {
          id: id,
        },
      });

      const articleDataCats = [];
      for (const item of articleCats) {
        const articleCatRet = await this.articleCatService.selectById({
          id: item,
        });
        const articleDataCat = new ArticleDataCat();
        articleDataCat.article = articleRet;
        articleDataCat.cat = articleCatRet;

        articleDataCats.push(articleDataCat);
      }

      const deleteRet = await this.articleDataCatService.deleteByArticleId(id);
      if (!deleteRet) {
        throw new ApiException('操作异常！', ApiErrorCode.ERROR, HttpStatus.OK);
      }

      const ret = await this.articleDataCatService.insertBatch(articleDataCats);

      if (ret) {
        return null;
      } else {
        throw new ApiException('操作异常！', ApiErrorCode.ERROR, HttpStatus.OK);
      }
    } catch (e) {
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  /**
   * 获取评论
   */
  async selectCommentById(baseFindByIdDto: BaseFindByIdDto): Promise<any> {
    try {
      const { id } = baseFindByIdDto;

      const [topicRet, commentRet] = await Promise.all([
        this.topicService.selectList({
          topicId: id,
          topicType: TopicType.ARTICLE,
        }),
        this.commentService.selectList({
          commentId: id,
        }),
      ]);

      // 转化成树
      const commentTree = Utils.construct(commentRet, {
        id: 'id',
        pid: 'replyId',
        children: 'children',
      });

      // 扁平化树
      commentTree.forEach((comment) => {
        let children = [];

        if (comment?.children?.length) {
          children = Utils.getNodeId(comment.children);
        }
        comment['children'] = children;
      });

      // 扁平化树与评论组装
      topicRet.forEach((topic) => {
        commentTree.forEach((comment) => {
          if (topic.id === comment.replyId) {
            if (topic?.children?.length) {
              topic['children'].push(comment);
            } else {
              topic['children'] = [];
              topic['children'].push(comment);
            }
          }
        });
      });

      return topicRet;
    } catch (e) {
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  /**
   * 获取评论
   */
  async selectCommentPageById(limitArticleTopDto: LimitArticleTopDto): Promise<any> {
    try {
      const { id, page, limit } = limitArticleTopDto;

      const [topicRet, commentRet] = await Promise.all([
        this.topicService.selectListPage({
          page,
          limit,
          topicId: id,
          topicType: TopicType.ARTICLE,
        }),
        this.commentService.selectList({
          commentId: id,
        }),
      ]);

      // 转化成树
      const commentTree = Utils.construct(commentRet, {
        id: 'id',
        pid: 'replyId',
        children: 'children',
      });

      // 扁平化树
      commentTree.forEach((comment) => {
        let children = [];

        if (comment?.children?.length > 0) {
          children = Utils.getNodeId(comment.children);
        }
        comment['children'] = children;
      });

      const { list, total } = topicRet;

      // 扁平化树与评论组装
      list.forEach((topic) => {
        commentTree.forEach((comment) => {
          if (topic.id === comment.replyId) {
            if (topic?.children?.length) {
              topic['children'].push(comment);
            } else {
              topic['children'] = [];
              topic['children'].push(comment);
            }
          }
        });
      });

      return {
        list: list,
        total: total,
        page: page,
        limit: limit,
      };
    } catch (e) {
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  /**
   * 评论
   */
  async insertComment(createArticleCommentDto: CreateArticleCommentDto, curUser?): Promise<any> {
    try {
      const { id, type, replyType, replyId, ...form } = createArticleCommentDto;

      if (type === 0) {
        const params = Object.assign(form, {
          topicType: TopicType.ARTICLE,
          topicId: id,
          fromUid: curUser.id,
        });

        return await this.topicService.insert(params, curUser);
      } else if (type === 1) {
        const params = Object.assign(form, {
          commentId: id,
          replyId: replyId,
          fromUid: curUser.id,
        });

        // @ts-ignore
        return await this.commentService.insert(params, curUser);
      }
    } catch (e) {
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  /**
   * 获取浏览排行
   */
  async selectBrowseRank(): Promise<any> {
    try {
      const ret = await this.cacheService.client.zrevrangebyscore(`${ArticlePrefix.ARTICLE_BROWSE_COUNT}`, '+inf', '-inf', 'withscores');
      const map = RedisUtil.arrayToMap(ret);
      const list = RedisUtil.mapToList(map);
      return list;
    } catch (e) {
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  /**
   * 浏览
   */
  async browse(baseFindByIdDto: BaseFindByIdDto, curUser): Promise<any> {
    try {
      const { id } = baseFindByIdDto;
      const isBrowseBefore = await this.cacheService.client.sismember(`${ArticlePrefix.ARTICLE_BROWSE}${id}`, curUser.id);

      if (isBrowseBefore === 1) {
        // 多次浏览
        await this.cacheService.client.zincrby(`${ArticlePrefix.ARTICLE_BROWSE_COUNT}`, 1, id);
        // 异步添加流水
        this.articleRepository.increment(
          { id: id },
          'browseCount',
          1,
        );
      } else {
        // 浏览
        await this.cacheService.client.sadd(`${ArticlePrefix.ARTICLE_BROWSE}${id}`, curUser.id);
        await this.cacheService.client.zincrby(`${ArticlePrefix.ARTICLE_BROWSE_COUNT}`, 1, id);
        // 异步添加流水
        this.articleRepository.increment(
          { id: id },
          'browseCount',
          1,
        );
      }

      const [userIds, browseCount, isBrowse] = await Promise.all([
        this.cacheService.client.smembers(`${ArticlePrefix.ARTICLE_BROWSE}${id}`),
        this.cacheService.client.scard(`${ArticlePrefix.ARTICLE_BROWSE}${id}`),
        this.cacheService.client.sismember(`${ArticlePrefix.ARTICLE_BROWSE}${id}`, curUser.id),
      ]);

      return {
        userIds: userIds,
        browseCount: browseCount,
        isBrowse: isBrowse,
      };
    } catch (e) {
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  /**
   * 获取点赞排行
   */
  async selectLinkRank(): Promise<any> {
    try {
      const ret = await this.cacheService.client.zrevrangebyscore(`${ArticlePrefix.ARTICLE_LINK_COUNT}`, '+inf', '-inf', 'withscores');
      const map = RedisUtil.arrayToMap(ret);
      const list = RedisUtil.mapToList(map);
      return list;
    } catch (e) {
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  /**
   * 点赞/取消点赞
   */
  async link(baseFindByIdDto: BaseFindByIdDto, curUser): Promise<any> {
    try {
      const { id } = baseFindByIdDto;
      const isLinkBefore = await this.cacheService.client.sismember(`${ArticlePrefix.ARTICLE_LINK}${id}`, curUser.id);

      if (isLinkBefore === 1) {
        // 取消点赞
        await this.cacheService.client.srem(`${ArticlePrefix.ARTICLE_LINK}${id}`, curUser.id);
        await this.cacheService.client.zincrby(`${ArticlePrefix.ARTICLE_LINK_COUNT}`, -1, id);
        // 异步添加流水
        this.articleLinkService.insert({
          articleId: id,
          status: 0,
        });
        // const decrementRet = await this.articleRepository.decrement(
        //   { id: id },
        //   'linkCount',
        //   1,
        // );
      } else {
        // 点赞
        await this.cacheService.client.sadd(`${ArticlePrefix.ARTICLE_LINK}${id}`, curUser.id);
        await this.cacheService.client.zincrby(`${ArticlePrefix.ARTICLE_LINK_COUNT}`, 1, id);
        // 异步添加流水
        this.articleLinkService.insert({
          articleId: id,
          status: 1,
        });
        // const incrementRet = await this.articleRepository.increment(
        //   { id: id },
        //   'linkCount',
        //   1,
        // );
      }

      const [userIds, linkCount, isLink] = await Promise.all([
        this.cacheService.client.smembers(`${ArticlePrefix.ARTICLE_LINK}${id}`),
        this.cacheService.client.scard(`${ArticlePrefix.ARTICLE_LINK}${id}`),
        this.cacheService.client.sismember(`${ArticlePrefix.ARTICLE_LINK}${id}`, curUser.id),
      ]);

      return {
        userIds: userIds,
        linkCount: linkCount,
        isLink: isLink,
      };
    } catch (e) {
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  /**
   * 获取收藏排行
   */
  async selectCollectRank(): Promise<any> {
    try {
      const ret = await this.cacheService.client.zrevrangebyscore(`${ArticlePrefix.ARTICLE_COLLECT_COUNT}`, '+inf', '-inf', 'withscores');
      const map = RedisUtil.arrayToMap(ret);
      const list = RedisUtil.mapToList(map);
      return list;
    } catch (e) {
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  /**
   * 收藏/取消收藏
   */
  async collect(baseFindByIdDto: BaseFindByIdDto, curUser): Promise<any> {
    try {
      const { id } = baseFindByIdDto;
      const isCollectBefore = await this.cacheService.client.sismember(`${ArticlePrefix.ARTICLE_COLLECT}${id}`, curUser.id);

      if (isCollectBefore === 1) {
        // 取消收藏
        await this.cacheService.client.srem(`${ArticlePrefix.ARTICLE_COLLECT}${id}`, curUser.id);
        await this.cacheService.client.zincrby(`${ArticlePrefix.ARTICLE_COLLECT_COUNT}`, -1, id);
        // 异步添加流水
        this.articleCollectService.insert({
          articleId: id,
          status: 0,
        });
        // const decrementRet = await this.articleRepository.decrement(
        //   { id: id },
        //   'collectCount',
        //   1,
        // );
      } else {
        // 收藏
        await this.cacheService.client.sadd(`${ArticlePrefix.ARTICLE_COLLECT}${id}`, curUser.id);
        await this.cacheService.client.zincrby(`${ArticlePrefix.ARTICLE_COLLECT_COUNT}`, 1, id);
        // 异步添加流水
        this.articleCollectService.insert({
          articleId: id,
          status: 1,
        });
        // const incrementRet = await this.articleRepository.increment(
        //   { id: id },
        //   'collectCount',
        //   1,
        // );
      }

      const [userIds, collectCount, isCollect] = await Promise.all([
        this.cacheService.client.smembers(`${ArticlePrefix.ARTICLE_COLLECT}${id}`),
        this.cacheService.client.scard(`${ArticlePrefix.ARTICLE_COLLECT}${id}`),
        this.cacheService.client.sismember(`${ArticlePrefix.ARTICLE_COLLECT}${id}`, curUser.id),
      ]);

      return {
        userIds: userIds,
        collectCount: collectCount,
        isCollect: isCollect,
      };
    } catch (e) {
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  /**
   * 获取评论排行
   */
  async selectShareRank(): Promise<any> {
    try {
      const ret = await this.cacheService.client.zrevrangebyscore(`${ArticlePrefix.ARTICLE_SHARE_COUNT}`, '+inf', '-inf', 'withscores');
      const map = RedisUtil.arrayToMap(ret);
      const list = RedisUtil.mapToList(map);
      return list;
    } catch (e) {
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  /**
   * 分享
   */
  async share(baseFindByIdDto: BaseFindByIdDto, curUser): Promise<any> {
    try {
      const { id } = baseFindByIdDto;
      const isLinkBefore = await this.cacheService.client.sismember(`${ArticlePrefix.ARTICLE_SHARE}${id}`, curUser.id);

      if (isLinkBefore === 1) {
        // 多次分享
        await this.cacheService.client.zincrby(`${ArticlePrefix.ARTICLE_SHARE_COUNT}`, 1, id);
        // 异步添加流水
        this.articleRepository.increment(
          { id: id },
          'shareCount',
          1,
        );
      } else {
        // 分享
        await this.cacheService.client.sadd(`${ArticlePrefix.ARTICLE_SHARE}${id}`, curUser.id);
        await this.cacheService.client.zincrby(`${ArticlePrefix.ARTICLE_SHARE_COUNT}`, 1, id);
        // 异步添加流水
        this.articleRepository.increment(
          { id: id },
          'shareCount',
          1,
        );
      }

      const [userIds, shareCount, isShare] = await Promise.all([
        this.cacheService.client.smembers(`${ArticlePrefix.ARTICLE_SHARE}${id}`),
        this.cacheService.client.scard(`${ArticlePrefix.ARTICLE_SHARE}${id}`),
        this.cacheService.client.sismember(`${ArticlePrefix.ARTICLE_SHARE}${id}`, curUser.id),
      ]);

      return {
        userIds: userIds,
        shareCount: shareCount,
        isShare: isShare,
      };
    } catch (e) {
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  /**
   * 获取评论排行
   */
  async selectCommentRank(): Promise<any> {
    try {
      const ret = await this.cacheService.client.zrevrangebyscore(`${ArticlePrefix.ARTICLE_COMMENT_COUNT}`, '+inf', '-inf', 'withscores');
      const map = RedisUtil.arrayToMap(ret);
      const list = RedisUtil.mapToList(map);
      return list;
    } catch (e) {
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  /**
   * 评论/取消评论
   */
  async comment(baseFindByIdDto: BaseFindByIdDto, curUser): Promise<any> {
    try {
      const { id } = baseFindByIdDto;

      const isLinkBefore = await this.cacheService.client.sismember(`${ArticlePrefix.ARTICLE_COMMENT}${id}`, curUser.id);

      if (isLinkBefore === 1) {
        // 多次评论
        await this.cacheService.client.zincrby(`${ArticlePrefix.ARTICLE_COMMENT_COUNT}`, 1, id);
        // 异步添加流水
        this.articleRepository.increment(
          { id: id },
          'commentCount',
          1,
        );
      } else {
        // 评论
        await this.cacheService.client.sadd(`${ArticlePrefix.ARTICLE_COMMENT}${id}`, curUser.id);
        await this.cacheService.client.zincrby(`${ArticlePrefix.ARTICLE_COMMENT_COUNT}`, 1, id);
        // 异步添加流水
        this.articleRepository.increment(
          { id: id },
          'commentCount',
          1,
        );
      }

      const [userIds, commentCount, isComment] = await Promise.all([
        this.cacheService.client.smembers(`${ArticlePrefix.ARTICLE_COMMENT}${id}`),
        this.cacheService.client.scard(`${ArticlePrefix.ARTICLE_COMMENT}${id}`),
        this.cacheService.client.sismember(`${ArticlePrefix.ARTICLE_COMMENT}${id}`, curUser.id),
      ]);

      return {
        userIds: userIds,
        commentCount: commentCount,
        isComment: isComment,
      };
    } catch (e) {
      throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }
}
