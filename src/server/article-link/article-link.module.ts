import { Module } from '@nestjs/common';
import { ArticleLinkService } from './article-link.service';
import { ArticleLinkController } from './article-link.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleLink } from './entities/user-article-link.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ArticleLink])],
  controllers: [ArticleLinkController],
  providers: [ArticleLinkService],
  exports: [ArticleLinkService],
})
export class ArticleLinkModule {
}
