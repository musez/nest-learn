import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { ApiBasicAuth, ApiTags } from '@nestjs/swagger';

@Controller('comment')
@ApiTags('评论回复')
@ApiBasicAuth('token')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}


}
