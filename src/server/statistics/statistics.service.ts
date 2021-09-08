import { Injectable } from '@nestjs/common';
import { CreateStatisticDto } from './dto/create-statistic.dto';
import { UpdateStatisticDto } from './dto/update-statistic.dto';
import { ApiException } from '../../common/exception/api-exception';
import { ArticleService } from '../article/article.service';

@Injectable()
export class StatisticsService {
  constructor(
    private readonly articleService: ArticleService,
  ) {
  }

  /**
   * 获取配置文件
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
      throw new ApiException('获取异常！', 500, 200);
    }
  }
}
