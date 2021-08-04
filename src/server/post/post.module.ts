import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { SysPost } from './entities/post.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SysPost])],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {
}
