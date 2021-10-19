import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleCatService } from './article-cat.service';
import { ArticleCatController } from './article-cat.controller';
import { ArticleCat } from './entities/article-cat.entity';
import { ArticleDataCatModule } from '../article-data-cat/article-data-cat.module';

@Module({
  imports: [ArticleDataCatModule, TypeOrmModule.forFeature([ArticleCat])],
  controllers: [ArticleCatController],
  providers: [ArticleCatService],
  exports: [ArticleCatService],
})
export class ArticleCatModule {
}
