import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { Utils } from '../../utils';
import { BaseFindByIdDto } from '../base.dto';
import { LimitCommentDto } from './dto/limit-comment.dto';
import { SearchCommentDto } from './dto/search-comment.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {
  }


  /**
   * 添加
   */
  async insert(createCommentDto: CreateCommentDto, curUser): Promise<CreateCommentDto> {
    return await this.commentRepository.save(createCommentDto);
  }

  /**
   * 获取列表
   */
  async selectList(searchCommentDto: SearchCommentDto): Promise<any[]> {
    const { content, replyType, status } = searchCommentDto;

    const queryConditionList = [];
    if (!Utils.isBlank(content)) {
      queryConditionList.push('content LIKE :content');
    }
    if (!Utils.isBlank(replyType)) {
      queryConditionList.push('replyType = :replyType');
    }
    if (!Utils.isBlank(status)) {
      queryConditionList.push('status = :status');
    }
    queryConditionList.push('deleteStatus = 0');
    const queryCondition = queryConditionList.join(' AND ');

    return await this.commentRepository.createQueryBuilder()
      .where(queryCondition, {
        content: `%${content}%`,
        replyType: replyType,
        status: status,
      })
      .orderBy({ 'createTime': 'DESC' })
      .getMany();
  }

  /**
   * 获取列表（分页）
   */
  async selectListPage(limitCommentDto: LimitCommentDto): Promise<any> {
    // eslint-disable-next-line prefer-const
    let { page, limit, content, replyType, status } = limitCommentDto;
    page = page ? Number(page) : 1;
    limit = limit ? Number(limit) : 10;
    const offset = (page - 1) * limit;

    const queryConditionList = [];
    if (!Utils.isBlank(content)) {
      queryConditionList.push('content LIKE :content');
    }
    if (!Utils.isBlank(replyType)) {
      queryConditionList.push('replyType = :replyType');
    }
    if (!Utils.isBlank(status)) {
      queryConditionList.push('status = :status');
    }
    queryConditionList.push('deleteStatus = 0');
    const queryCondition = queryConditionList.join(' AND ');

    const res = await this.commentRepository.createQueryBuilder()
      .where(queryCondition, {
        content: `%${content}%`,
        replyType: replyType,
        status: status,
      })
      .skip(offset)
      .take(limit)
      .orderBy({ 'createTime': 'DESC' })
      .getManyAndCount();

    return {
      list: res[0],
      total: res[1],
      page: page,
      limit: limit,
    };
  }

  /**
   * 获取详情（主键 id）
   */
  async selectById(baseFindByIdDto: BaseFindByIdDto): Promise<Comment> {
    const { id } = baseFindByIdDto;
    return await this.commentRepository.findOne(id);
  }

  /**
   * 是否存在（主键 id）
   */
  async isExistId(id: string): Promise<boolean> {
    const isExist = await this.commentRepository.findOne(id);
    if (Utils.isNil(isExist)) {
      return false;
    } else {
      return true;
    }
  }

  /**
   * 修改
   */
  async update(updateCommentDto: UpdateCommentDto, curUser): Promise<void> {
    const { id } = updateCommentDto;

    let article = new Comment();
    article = Utils.dto2entity(updateCommentDto, article);

    await this.commentRepository.update(id, article);
  }
}
