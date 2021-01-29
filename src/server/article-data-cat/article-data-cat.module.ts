import { Module } from '@nestjs/common';
import { ArticleDataCatService } from './article-data-cat.service';
import { ArticleDataCatController } from './article-data-cat.controller';

@Module({
  controllers: [ArticleDataCatController],
  providers: [ArticleDataCatService]
})
export class ArticleDataCatModule {}
