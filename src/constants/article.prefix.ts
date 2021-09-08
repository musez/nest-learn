export class ArticlePrefix {
  static readonly ARTICLE_BROWSE: string = 'article:browse:';// 浏览（set） article:browse:${articleId}
  static readonly ARTICLE_BROWSE_COUNT: string = 'article:browse:count';// 浏览数量（sorted set） article:browse:count:${articleId}

  static readonly ARTICLE_LINK: string = 'article:link:';// 点赞用户（set） article:link:${articleId}
  static readonly ARTICLE_LINK_COUNT: string = 'article:link:count';// 点赞数量（sorted set） article:link:count:${articleId}

  static readonly ARTICLE_COLLECT: string = 'article:collect:';// 收藏用户（set） article:collect:${articleId}
  static readonly ARTICLE_COLLECT_COUNT: string = 'article:collect:count';// 收藏数量（sorted set） article:collect:count:${articleId}

  static readonly ARTICLE_SHARE: string = 'article:share:';// 分享用户（set） article:share:${articleId}
  static readonly ARTICLE_SHARE_COUNT: string = 'article:share:count';// 分享数量（sorted set） article:share:count:${articleId}

  static readonly ARTICLE_COMMENT: string = 'article:comment:';// 评论用户（set） article:comment:${articleId}
  static readonly ARTICLE_COMMENT_COUNT: string = 'article:comment:count';// 评论数量（sorted set） article:comment:count:${articleId}
}
