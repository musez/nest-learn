import { Module } from '@nestjs/common';
import { TopicService } from './topic.service';
import { TopicController } from './topic.controller';
import { UserModule } from '../user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Topic } from './entities/topic.entity';

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([Topic])],
  controllers: [TopicController],
  providers: [TopicService]
})
export class TopicModule {}
