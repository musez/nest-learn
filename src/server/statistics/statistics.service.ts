import { HttpStatus, Injectable } from '@nestjs/common';
import { ApiException } from '../../common/exception/api-exception';
import { ArticleService } from '../article/article.service';
import { ApiErrorCode } from '../../constants/api-error-code.enum';
import { UserService } from '../user/user.service';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';

@Injectable()
export class StatisticsService {
  constructor(
    private readonly articleService: ArticleService,
    private readonly userService: UserService,
  ) {
  }

  /**
   * 获取面板信息
   */
  public async selectCount() {
    return await this.userService.selectOnline();
  }

  /**
   * 获取获取新闻
   */
  public async selectArticle() {
    const [browseRet, linkRet, collectRet, shareRet, commentRet] = await Promise.all([
      this.articleService.selectBrowseRank(),
      this.articleService.selectLinkRank(),
      this.articleService.selectCollectRank(),
      this.articleService.selectShareRank(),
      this.articleService.selectCommentRank(),
    ]);

    if (browseRet && linkRet && collectRet && shareRet && commentRet) {
      return Object.assign({}, browseRet, linkRet, collectRet, shareRet, commentRet);
    } else {
      throw new ApiException('获取异常！', ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }
}
