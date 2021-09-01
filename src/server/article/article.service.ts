import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Utils } from './../../utils/index';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import {
  BaseFindByIdDto,
  BaseFindByIdsDto,
  BaseModifyStatusByIdsDto,
} from '../base.dto';
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

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
    private readonly articleCatService: ArticleCatService,
    private readonly articleDataCatService: ArticleDataCatService,
    private readonly topicService: TopicService,
    private readonly commentService: CommentService,
    private readonly cacheService: CacheService,
  ) {
  }

  /**
   * 添加
   */
  async insert(createArticleDto: CreateArticleDto, curUser?): Promise<any> {
    const { cats } = createArticleDto;

    let article = new Article();
    article = Utils.dto2entity(createArticleDto, article);

    const ret = await this.articleRepository.save(article);
    if (!ret) {
      throw new ApiException('操作异常！', 500);
    }
    return await this.bindArticleCats(ret.id, cats);
  }

  /**
   * 获取列表
   */
  async selectList(searchArticleDto: SearchArticleDto): Promise<any[]> {
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
        status = Utils.split(status.toString());
      }
      queryConditionList.push('status IN (:...status)');
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
  }

  /**
   * 获取列表（分页）
   */
  async selectListPage(limitArticleDto: LimitArticleDto): Promise<any> {
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
        status = Utils.split(status.toString());
      }
      queryConditionList.push('status IN (:...status)');
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

    for (let item of ret[0]) {
      const { articleDataCats } = item;
      if (articleDataCats?.length > 0) {
        const ids = articleDataCats.map((v) => v.id);
        const retRel = await this.articleDataCatService.selectByArticleDataCatIds(ids);

        item = Object.assign(item, {
          articleDataCats: retRel.map((v) => v.cat),
        });
      }
    }

    return {
      list: ret[0],
      total: ret[1],
      page: page,
      limit: limit,
    };
  }

  /**
   * 获取详情（主键 id）
   */
  async selectById(baseFindByIdDto: BaseFindByIdDto): Promise<Article> {
    const { id } = baseFindByIdDto;
    const ret = await this.articleRepository.findOne({
      relations: ['articleDataCats'],
      where: {
        id: id,
      },
    });
    if (!ret) {
      throw new ApiException(`数据 id：${id} 不存在！`, 404);
    }
    if (ret?.articleDataCats?.length > 0) {
      const ids = ret.articleDataCats.map((v) => v.id);

      const articleDataCatRet = await this.articleDataCatService.selectByArticleDataCatIds(ids);

      // @ts-ignore
      ret.articleDataCats = articleDataCatRet.map((v) => {
        return v.cat;
      });
    }

    return ret;
  }

  /**
   * 是否存在（主键 id）
   */
  async isExistId(id: string): Promise<boolean> {
    const isExist = await this.articleRepository.findOne(id);
    if (Utils.isNil(isExist)) {
      return false;
    } else {
      return true;
    }
  }

  /**
   * 修改
   */
  async update(updateArticleDto: UpdateArticleDto, curUser?): Promise<any> {
    const { id, cats } = updateArticleDto;

    let article = new Article();
    article = Utils.dto2entity(updateArticleDto, article);

    const ret = await this.articleRepository.update(id, article);
    if (!ret) {
      throw new ApiException('操作异常！', 500);
    }

    if (cats) {
      return await this.bindArticleCats(id, cats);
    } else {
      return ret;
    }
  }

  /**
   * 回收站状态修改
   */
  async updateStatus(baseModifyStatusByIdsDto: BaseModifyStatusByIdsDto, curUser?): Promise<void> {
    // eslint-disable-next-line prefer-const
    let { ids, status } = baseModifyStatusByIdsDto;
    if (!Utils.isArray(ids)) {
      ids = Utils.split(ids.toString());
    }
    await this.articleRepository
      .createQueryBuilder()
      .update(Article)
      .set({ status: status, updateBy: curUser ? curUser!.id : null })
      .where('id IN (:ids)', { ids: ids })
      .execute();
  }

  /**
   * 回收站删除
   */
  async deleteById(baseFindByIdDto: BaseFindByIdDto, curUser?): Promise<void> {
    const { id } = baseFindByIdDto;

    await this.articleRepository
      .createQueryBuilder()
      .update(Article)
      .set({ deleteStatus: 1, deleteBy: curUser ? curUser!.id : null, deleteTime: Utils.now() })
      .where('id = :id', { id: id })
      .execute();
  }

  /**
   * 回收站删除（批量）
   */
  async deleteByIds(baseFindByIdsDto: BaseFindByIdsDto, curUser?): Promise<void> {
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
  }

  /**
   * 回收站清空
   */
  async deleteAll(curUser?): Promise<void> {
    await this.articleRepository
      .createQueryBuilder()
      .update(Article)
      .set({ deleteStatus: 1, deleteBy: curUser ? curUser!.id : null, deleteTime: Utils.now() })
      .where('status = 3')
      .execute();
  }

  /**
   * 绑定栏目
   */
  async bindArticleCats(id: string, cats: string): Promise<void> {
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
      throw new ApiException('操作异常！', 500);
    }

    const ret = await this.articleDataCatService.insertBatch(articleDataCats);

    if (ret) {
      return null;
    } else {
      throw new ApiException('操作异常！', 500);
    }
  }

  /**
   * 获取评论
   */
  async selectCommentById(baseFindByIdDto: BaseFindByIdDto): Promise<any> {
    const { id } = baseFindByIdDto;

    const [topicRet, commentRet] = await Promise.all([
      this.topicService.selectList({
        topicId: id,
        topicType: 0,
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
  }

  /**
   * 获取评论
   */
  async selectCommentPageById(
    limitArticleTopDto: LimitArticleTopDto,
  ): Promise<any> {
    const { id, page, limit } = limitArticleTopDto;

    const [topicRet, commentRet] = await Promise.all([
      this.topicService.selectListPage({
        page,
        limit,
        topicId: id,
        topicType: 0,
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
  }

  /**
   * 评论
   */
  async insertComment(createArticleCommentDto: CreateArticleCommentDto, curUser?): Promise<any> {
    const { id, type, replyType, replyId, ...form } = createArticleCommentDto;

    if (type === 0) {
      const params = Object.assign(form, {
        topicType: 0,
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
  }

  /**
   * 获取浏览排行
   */
  async selectBrowseRank(): Promise<any> {
    const client = await this.cacheService.getClient();

    return await client.zrevrangebyscore(`${ArticlePrefix.ARTICLE_BROWSE_COUNT}`, '+inf', '-inf', 'withscores');
  }

  /**
   * 浏览
   */
  async browse(baseFindByIdDto: BaseFindByIdDto, curUser): Promise<any> {
    const { id } = baseFindByIdDto;
    const client = await this.cacheService.getClient();

    const isBrowseBefore = await client.sismember(`${ArticlePrefix.ARTICLE_BROWSE}${id}`, curUser.id);

    if (isBrowseBefore === 1) {
      // 多次浏览
      client.zincrby(`${ArticlePrefix.ARTICLE_BROWSE_COUNT}`, 1, id);
      const incrementRet = await this.articleRepository.increment(
        { id: id },
        'browseCount',
        1,
      );
    } else {
      // 浏览
      client.sadd(`${ArticlePrefix.ARTICLE_BROWSE}${id}`, curUser.id);
      client.zincrby(`${ArticlePrefix.ARTICLE_BROWSE_COUNT}`, 1, id);
      const incrementRet = await this.articleRepository.increment(
        { id: id },
        'browseCount',
        1,
      );
    }

    const [userIds, browseIds, isBrowse] = await Promise.all([
      client.smembers(`${ArticlePrefix.ARTICLE_BROWSE}${id}`),
      client.scard(`${ArticlePrefix.ARTICLE_BROWSE}${id}`),
      client.sismember(`${ArticlePrefix.ARTICLE_BROWSE}${id}`, curUser.id),
    ]);

    return {
      userIds: userIds,
      browseIds: browseIds,
      isBrowse: isBrowse,
    };
  }

  /**
   * 获取点赞排行
   */
  async selectLinkRank(): Promise<any> {
    const client = await this.cacheService.getClient();

    return await client.zrevrangebyscore(`${ArticlePrefix.ARTICLE_LINK_COUNT}`, '+inf', '-inf', 'withscores');
  }

  /**
   * 点赞/取消点赞
   */
  async link(baseFindByIdDto: BaseFindByIdDto, curUser): Promise<any> {
    const { id } = baseFindByIdDto;
    const client = await this.cacheService.getClient();

    const isLinkBefore = await client.sismember(`${ArticlePrefix.ARTICLE_LINK}${id}`, curUser.id);

    if (isLinkBefore === 1) {
      // 取消点赞
      client.srem(`${ArticlePrefix.ARTICLE_LINK}${id}`, curUser.id);
      client.zincrby(`${ArticlePrefix.ARTICLE_LINK_COUNT}`, -1, id);
      const decrementRet = await this.articleRepository.decrement(
        { id: id },
        'linkCount',
        1,
      );
    } else {
      // 点赞
      client.sadd(`${ArticlePrefix.ARTICLE_LINK}${id}`, curUser.id);
      client.zincrby(`${ArticlePrefix.ARTICLE_LINK_COUNT}`, 1, id);
      const incrementRet = await this.articleRepository.increment(
        { id: id },
        'linkCount',
        1,
      );
    }

    const [userIds, linkIds, isLink] = await Promise.all([
      client.smembers(`${ArticlePrefix.ARTICLE_LINK}${id}`),
      client.scard(`${ArticlePrefix.ARTICLE_LINK}${id}`),
      client.sismember(`${ArticlePrefix.ARTICLE_LINK}${id}`, curUser.id),
    ]);

    return {
      userIds: userIds,
      linkIds: linkIds,
      isLink: isLink,
    };
  }

  /**
   * 获取收藏排行
   */
  async selectCollectRank(): Promise<any> {
    const client = await this.cacheService.getClient();

    return await client.zrevrangebyscore(`${ArticlePrefix.ARTICLE_COLLECT_COUNT}`, '+inf', '-inf', 'withscores');
  }

  /**
   * 收藏/取消收藏
   */
  async collect(baseFindByIdDto: BaseFindByIdDto, curUser): Promise<any> {
    const { id } = baseFindByIdDto;
    const client = await this.cacheService.getClient();

    const isCollectBefore = await client.sismember(`${ArticlePrefix.ARTICLE_COLLECT}${id}`, curUser.id);

    if (isCollectBefore === 1) {
      // 取消收藏
      client.srem(`${ArticlePrefix.ARTICLE_COLLECT}${id}`, curUser.id);
      client.zincrby(`${ArticlePrefix.ARTICLE_COLLECT_COUNT}`, -1, id);
      const decrementRet = await this.articleRepository.decrement(
        { id: id },
        'collectCount',
        1,
      );
    } else {
      // 收藏
      client.sadd(`${ArticlePrefix.ARTICLE_COLLECT}${id}`, curUser.id);
      client.zincrby(`${ArticlePrefix.ARTICLE_COLLECT_COUNT}`, 1, id);
      const incrementRet = await this.articleRepository.increment(
        { id: id },
        'collectCount',
        1,
      );
    }

    const [userIds, collectIds, isCollect] = await Promise.all([
      client.smembers(`${ArticlePrefix.ARTICLE_COLLECT}${id}`),
      client.scard(`${ArticlePrefix.ARTICLE_COLLECT}${id}`),
      client.sismember(`${ArticlePrefix.ARTICLE_COLLECT}${id}`, curUser.id),
    ]);

    return {
      userIds: userIds,
      collectIds: collectIds,
      isCollect: isCollect,
    };
  }

  /**
   * 获取评论排行
   */
  async selectShareRank(): Promise<any> {
    const client = await this.cacheService.getClient();

    return await client.zrevrangebyscore(`${ArticlePrefix.ARTICLE_SHARE_COUNT}`, '+inf', '-inf', 'withscores');
  }

  /**
   * 分享/取消分享
   */
  async share(baseFindByIdDto: BaseFindByIdDto, curUser): Promise<any> {
    const { id } = baseFindByIdDto;
    const client = await this.cacheService.getClient();

    const isLinkBefore = await client.sismember(`${ArticlePrefix.ARTICLE_SHARE}${id}`, curUser.id);

    if (isLinkBefore === 1) {
      // 取消多次分享
      client.zincrby(`${ArticlePrefix.ARTICLE_SHARE_COUNT}`, 1, id);
      const incrementRet = await this.articleRepository.increment(
        { id: id },
        'shareCount',
        1,
      );
    } else {
      // 分享
      client.sadd(`${ArticlePrefix.ARTICLE_SHARE}${id}`, curUser.id);
      client.zincrby(`${ArticlePrefix.ARTICLE_SHARE_COUNT}`, 1, id);
      const incrementRet = await this.articleRepository.increment(
        { id: id },
        'shareCount',
        1,
      );
    }

    const [userIds, shareIds, isShare] = await Promise.all([
      client.smembers(`${ArticlePrefix.ARTICLE_SHARE}${id}`),
      client.scard(`${ArticlePrefix.ARTICLE_SHARE}${id}`),
      client.sismember(`${ArticlePrefix.ARTICLE_SHARE}${id}`, curUser.id),
    ]);

    return {
      userIds: userIds,
      shareIds: shareIds,
      isShare: isShare,
    };
  }

  /**
   * 获取评论排行
   */
  async selectCommentRank(): Promise<any> {
    const client = await this.cacheService.getClient();

    return await client.zrevrangebyscore(`${ArticlePrefix.ARTICLE_COMMENT_COUNT}`, '+inf', '-inf', 'withscores');
  }

  /**
   * 评论/取消评论
   */
  async comment(baseFindByIdDto: BaseFindByIdDto, curUser): Promise<any> {
    const { id } = baseFindByIdDto;
    const client = await this.cacheService.getClient();

    const isLinkBefore = await client.sismember(`${ArticlePrefix.ARTICLE_COMMENT}${id}`, curUser.id);

    if (isLinkBefore === 1) {
      // 多次评论
      client.zincrby(`${ArticlePrefix.ARTICLE_COMMENT_COUNT}`, 1, id);
      const incrementRet = await this.articleRepository.increment(
        { id: id },
        'commentCount',
        1,
      );
    } else {
      // 评论
      client.sadd(`${ArticlePrefix.ARTICLE_COMMENT}${id}`, curUser.id);
      client.zincrby(`${ArticlePrefix.ARTICLE_COMMENT_COUNT}`, 1, id);
      const incrementRet = await this.articleRepository.increment(
        { id: id },
        'commentCount',
        1,
      );
    }

    const [userIds, commentIds, isComment] = await Promise.all([
      client.smembers(`${ArticlePrefix.ARTICLE_COMMENT}${id}`),
      client.scard(`${ArticlePrefix.ARTICLE_COMMENT}${id}`),
      client.sismember(`${ArticlePrefix.ARTICLE_COMMENT}${id}`, curUser.id),
    ]);

    return {
      userIds: userIds,
      commentIds: commentIds,
      isComment: isComment,
    };
  }
}
