import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards } from '@nestjs/common';
import { TopicService } from './topic.service';
import { CreateTopicDto } from './dto/create-topic.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';
import { ApiBasicAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthGuard } from '../../common/guards/auth.guard';

@ApiTags('评论')
@Controller('topic')
@ApiBasicAuth('token')
@UseGuards(JwtAuthGuard, AuthGuard)
export class TopicController {
  constructor(private readonly topicService: TopicService) {}


}
