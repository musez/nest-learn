import { Module } from '@nestjs/common';
import { ArticleCatService } from './article-cat.service';
import { ArticleCatController } from './article-cat.controller';

@Module({
  controllers: [ArticleCatController],
  providers: [ArticleCatService]
})
export class ArticleCatModule {}
