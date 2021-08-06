import { Module } from '@nestjs/common';
import { ArticleDataCatService } from './article-data-cat.service';
import { ArticleDataCatController } from './article-data-cat.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleDataCat } from './entities/article-data-cat.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ArticleDataCat])],
  controllers: [ArticleDataCatController],
  providers: [ArticleDataCatService],
  exports: [ArticleDataCatService],
})
export class ArticleDataCatModule {
}
