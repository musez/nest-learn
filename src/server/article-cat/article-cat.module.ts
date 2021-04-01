import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleCatService } from './article-cat.service';
import { ArticleCatController } from './article-cat.controller';
import { ArticleCat } from './entities/article-cat.entity';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([ArticleCat])],
  controllers: [ArticleCatController],
  providers: [ArticleCatService],
})
export class ArticleCatModule {
}
