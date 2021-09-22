import { Module } from '@nestjs/common';
import { ArticleCollectService } from './article-collect.service';
import { ArticleCollectController } from './article-collect.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleCollect } from './entities/article-collect.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ArticleCollect])],
  controllers: [ArticleCollectController],
  providers: [ArticleCollectService],
  exports: [ArticleCollectService],
})
export class ArticleCollectModule {
}
