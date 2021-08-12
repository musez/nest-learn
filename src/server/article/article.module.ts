import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleService } from './article.service';
import { ArticleController } from './article.controller';
import { Article } from './entities/article.entity';
import { ArticleCatModule } from '../article-cat/article-cat.module';
import { ArticleDataCatModule } from '../article-data-cat/article-data-cat.module';
import { TopicModule } from '../topic/topic.module';
import { CommentModule } from '../comment/comment.module';

@Module({
  imports: [ArticleCatModule, ArticleDataCatModule, TopicModule, CommentModule, TypeOrmModule.forFeature([Article])],
  controllers: [ArticleController],
  providers: [ArticleService],
})
export class ArticleModule {
}
