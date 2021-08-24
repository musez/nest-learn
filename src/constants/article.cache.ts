export class ArticleCache {
  static readonly ARTICLE_BROWSE: string = 'article:browse:';// 浏览 article:browse:${articleId}
  static readonly ARTICLE_BROWSE_COUNT: string = 'article:browse:count:';// 浏览数量 article:browse:count:${articleId}
  static readonly ARTICLE_BROWSE_USER: string = 'article:user:';// 用户点赞文章 article:link:user:${userId}

  static readonly ARTICLE_LINK: string = 'article:link:';// 点赞用户 article:link:${articleId}
  static readonly ARTICLE_LINK_COUNT: string = 'article:link:count:';// 点赞数量 article:link:count:${articleId}
  static readonly ARTICLE_LINK_USER: string = 'article:link:user:';// 用户点赞文章 article:link:user:${userId}

  static readonly ARTICLE_COLLECT: string = 'article:collect:';// 收藏用户 article:collect:${articleId}
  static readonly ARTICLE_COLLECT_COUNT: string = 'article:collect:count:';// 收藏数量 article:collect:count:${articleId}
  static readonly ARTICLE_COLLECT_USER: string = 'article:collect:user:';// 用户收藏文章 article:collect:user:${userId}

  static readonly ARTICLE_SHARE: string = 'article:share:';// 分享用户 article:share:${articleId}
  static readonly ARTICLE_SHARE_COUNT: string = 'article:share:count:';// 分享数量 article:share:count:${articleId}
  static readonly ARTICLE_SHARE_USER: string = 'article:share:user:';// 用户点赞文章 article:link:user:${userId}

  static readonly ARTICLE_COMMENT: string = 'article:comment:';// 评论用户 article:comment:${articleId}
  static readonly ARTICLE_COMMENT_COUNT: string = 'article:comment:count:';// 评论数量 article:comment:count:${articleId}
  static readonly ARTICLE_COMMENT_USER: string = 'article:comment:user:';// 用户点赞文章 article:link:user:${userId}
}
