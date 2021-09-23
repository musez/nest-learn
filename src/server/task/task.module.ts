import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { AppService } from '../../app.service';
import { ArticleModule } from '../article/article.module';
import { ArticleLinkModule } from '../article-link/article-link.module';
import { ArticleCollectModule } from '../article-collect/article-collect.module';

@Module({
  imports: [ArticleModule, ArticleLinkModule, ArticleCollectModule],
  controllers: [TaskController],
  providers: [AppService, TaskService],
})
export class TaskModule {
}
