import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { Utils } from '../../utils';
import { BaseFindByIdDto, BaseFindByIdsDto } from '../base.dto';
import { LimitCommentDto } from './dto/limit-comment.dto';
import { SearchCommentDto } from './dto/search-comment.dto';
import { Org } from '../org/entities/org.entity';
import { User } from '../user/entities/user.entity';

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
    const { commentId, content, replyType, status } = searchCommentDto;

    const queryConditionList = [];
    if (!Utils.isBlank(commentId)) {
      queryConditionList.push('comment.commentId = :commentId');
    }
    if (!Utils.isBlank(content)) {
      queryConditionList.push('comment.content LIKE :content');
    }
    if (!Utils.isBlank(replyType)) {
      queryConditionList.push('comment.replyType = :replyType');
    }
    if (!Utils.isBlank(status)) {
      queryConditionList.push('comment.status = :status');
    }
    queryConditionList.push('comment.deleteStatus = 0');
    const queryCondition = queryConditionList.join(' AND ');

    return await this.commentRepository.createQueryBuilder('comment')
      .leftJoinAndSelect(User, 'uf', 'uf.id = comment.fromUid')
      .leftJoinAndSelect(User, 'ut', 'ut.id = comment.fromUid')
      .select('comment.*')
      .addSelect(`
       uf.userName AS fromUname,
       ut.userName AS toUname
       `)
      .where(queryCondition, {
        commentId: commentId,
        content: `%${content}%`,
        replyType: replyType,
        status: status,
      })
      .orderBy({ 'comment.createTime': 'DESC' })
      .getRawMany();
  }

  /**
   * 获取列表（分页）
   */
  async selectListPage(limitCommentDto: LimitCommentDto): Promise<any> {
    // eslint-disable-next-line prefer-const
    let { page, limit, content, replyType, status } = limitCommentDto;
    page = page ? page : 1;
    limit = limit ? limit : 10;
    const offset = (page - 1) * limit;

    const queryConditionList = [];
    if (!Utils.isBlank(content)) {
      queryConditionList.push('comment.content LIKE :content');
    }
    if (!Utils.isBlank(replyType)) {
      queryConditionList.push('comment.replyType = :replyType');
    }
    if (!Utils.isBlank(status)) {
      queryConditionList.push('comment.status = :status');
    }
    queryConditionList.push('comment.deleteStatus = 0');
    const queryCondition = queryConditionList.join(' AND ');

    const ret = await this.commentRepository.createQueryBuilder('comment')
      .leftJoinAndSelect(User, 'uf', 'uf.id = comment.fromUid')
      .leftJoinAndSelect(User, 'ut', 'ut.id = comment.toUid')
      .select('comment.*')
      .addSelect(`
       uf.userName AS fromUname,
       ut.userName AS toUname
       `)
      .where(queryCondition, {
        content: `%${content}%`,
        replyType: replyType,
        status: status,
      })
      .skip(offset)
      .take(limit)
      .orderBy({ 'comment.createTime': 'DESC' })
      .getRawMany();

    const retCount = await this.commentRepository.createQueryBuilder('comment')
      .leftJoinAndSelect(User, 'uf', 'uf.id = comment.fromUid')
      .leftJoinAndSelect(User, 'ut', 'ut.id = comment.fromUid')
      .select('comment.*')
      .addSelect(`
       uf.userName AS fromUname,
       ut.userName AS toUname
       `)
      .where(queryCondition, {
        content: `%${content}%`,
        replyType: replyType,
        status: status,
      })
      .getCount();

    return {
      list: ret,
      total: retCount,
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

  /**
   * 删除
   */
  async deleteById(baseFindByIdDto: BaseFindByIdDto, curUser): Promise<void> {
    const { id } = baseFindByIdDto;

    await this.commentRepository.createQueryBuilder()
      .update(Org)
      .set({ deleteStatus: 1, deleteBy: curUser!.id, deleteTime: Utils.now() })
      .where('id = :id', { id: id })
      .execute();
  }

  /**
   * 删除（批量）
   */
  async deleteByIds(baseFindByIdsDto: BaseFindByIdsDto, curUser): Promise<void> {
    const { ids } = baseFindByIdsDto;

    await this.commentRepository.createQueryBuilder()
      .update(Org)
      .set({ deleteStatus: 1, deleteBy: curUser!.id, deleteTime: Utils.now() })
      .where('id in (:ids)', { ids: ids })
      .execute();
  }
}
