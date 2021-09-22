import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleService } from './article.service';
import { ArticleController } from './article.controller';
import { Article } from './entities/article.entity';
import { ArticleCatModule } from '../article-cat/article-cat.module';
import { ArticleDataCatModule } from '../article-data-cat/article-data-cat.module';
import { TopicModule } from '../topic/topic.module';
import { CommentModule } from '../comment/comment.module';
import { ArticleLinkModule } from '../article-link/article-link.module';
import { ArticleCollectModule } from '../article-collect/article-collect.module';

@Module({
  imports: [
    ArticleCatModule,
    ArticleDataCatModule,
    ArticleLinkModule,
    ArticleCollectModule,
    TopicModule,
    CommentModule,
    TypeOrmModule.forFeature([Article]),
  ],
  controllers: [ArticleController],
  providers: [ArticleService],
  exports: [ArticleService],
})
export class ArticleModule {}
