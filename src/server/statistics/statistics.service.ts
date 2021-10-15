import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ApiException } from '../../common/exception/api-exception';
import { ArticleService } from '../article/article.service';
import { ApiErrorCode } from '../../constants/api-error-code.enum';
import { UserService } from '../user/user.service';

@Injectable()
export class StatisticsService {
  private readonly logger = new Logger(StatisticsService.name);

  constructor(
    private readonly articleService: ArticleService,
    private readonly userService: UserService,
  ) {
  }

  /**
   * 获取在线用户
   */
  public async selectOnline() {
    return await this.userService.selectOnline();
  }

  /**
   * 获取新闻排行
   */
  public async selectArticleRank() {
    const [browseRet, linkRet, collectRet, shareRet, commentRet] = await Promise.all([
      this.articleService.selectBrowseRank(),
      this.articleService.selectLinkRank(),
      this.articleService.selectCollectRank(),
      this.articleService.selectShareRank(),
      this.articleService.selectCommentRank(),
    ]);

    if (browseRet && linkRet && collectRet && shareRet && commentRet) {
      return {
        browse: browseRet,
        link: linkRet,
        collect: collectRet,
        share: shareRet,
        comment: commentRet,
      };
    } else {
      throw new ApiException('获取异常！', ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  /**
   * 获取新闻各个状态数量
   */
  public async selectArticleStatusCount() {
    return this.articleService.selectStatusCount();
  }
}
