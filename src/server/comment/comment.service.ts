import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { Utils } from '../../utils';
import { BaseFindByIdDto, BaseFindByIdsDto, BaseModifyStatusByIdsDto } from '../base.dto';
import { LimitCommentDto } from './dto/limit-comment.dto';
import { SearchCommentDto } from './dto/search-comment.dto';
import { Org } from '../org/entities/org.entity';
import { User } from '../user/entities/user.entity';
import { ApiException } from '../../common/exception/api-exception';
import { ApiErrorCode } from '../../constants/api-error-code.enum';

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
  async insert(createCommentDto: CreateCommentDto, curUser?): Promise<CreateCommentDto> {
    return await this.commentRepository.save(createCommentDto);
  }

  /**
   * 获取列表
   */
  async selectList(searchCommentDto: SearchCommentDto): Promise<any[]> {
    // eslint-disable-next-line prefer-const
    let { commentId, content, replyType, status } = searchCommentDto;

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
      if (!Utils.isArray(status)) {
        status = Utils.split(status.toString());
      }
      queryConditionList.push('comment.status IN (:...status)');
    }
    queryConditionList.push('comment.deleteStatus = 0');
    const queryCondition = queryConditionList.join(' AND ');

    return await this.commentRepository
      .createQueryBuilder('comment')
      .leftJoinAndSelect(User, 'uf', 'uf.id = comment.fromUid')
      .leftJoinAndSelect(User, 'ut', 'ut.id = comment.toUid')
      .select('comment.*')
      .addSelect(
        `
       uf.userName AS fromUname,
       ut.userName AS toUname
       `,
      )
      .where(queryCondition, {
        commentId: commentId,
        content: `%${content}%`,
        replyType: replyType,
        status: status,
      })
      .orderBy({
        'comment.status': 'ASC',
        'comment.createTime': 'ASC',
      })
      .getRawMany();
  }

  /**
   * 获取列表（分页）
   */
  async selectListPage(limitCommentDto: LimitCommentDto): Promise<any> {
    // eslint-disable-next-line prefer-const
    let { page, limit, commentId, content, replyType, status } = limitCommentDto;
    page = page ? page : 1;
    limit = limit ? limit : 10;
    const offset = (page - 1) * limit;

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
      if (!Utils.isArray(status)) {
        status = Utils.split(status.toString());
      }
      queryConditionList.push('comment.status IN (:...status)');
    }
    queryConditionList.push('comment.deleteStatus = 0');
    const queryCondition = queryConditionList.join(' AND ');

    const queryBuilder = this.commentRepository
      .createQueryBuilder('comment')
      .leftJoinAndSelect(User, 'uf', 'uf.id = comment.fromUid')
      .leftJoinAndSelect(User, 'ut', 'ut.id = comment.toUid')
      .select('comment.*')
      .addSelect(
        `
       uf.userName AS fromUname,
       ut.userName AS toUname
       `,
      )
      .where(queryCondition, {
        commentId: commentId,
        content: `%${content}%`,
        replyType: replyType,
        status: status,
      });

    const ret = await queryBuilder
      // .skip(offset)
      // .take(limit)
      .offset(offset)
      .limit(limit)
      .orderBy({
        'comment.status': 'ASC',
        'comment.createTime': 'ASC',
      })
      .getRawMany();

    const retCount = await queryBuilder.getCount();

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
  async update(updateCommentDto: UpdateCommentDto, curUser?): Promise<void> {
    const { id } = updateCommentDto;

    let article = new Comment();
    article = Utils.dto2entity(updateCommentDto, article);

    await this.commentRepository.update(id, article);
  }

  /**
   * 修改状态
   */
  async updateStatus(baseModifyStatusByIdsDto: BaseModifyStatusByIdsDto, curUser?): Promise<any> {
    // eslint-disable-next-line prefer-const
    let { ids, status } = baseModifyStatusByIdsDto;
    if (!Utils.isArray(ids)) {
      ids = Utils.split(ids.toString());
    }

    const ret = this.commentRepository
      .createQueryBuilder()
      .update(Comment)
      .set({ status: status, updateBy: curUser ? curUser!.id : null })
      .where('id IN (:ids)', { ids: ids })
      .execute();

    if (!ret) {
      throw new ApiException('更新异常！', ApiErrorCode.ERROR, HttpStatus.OK);
    }

    return ret;
  }

  /**
   * 删除
   */
  async deleteById(baseFindByIdDto: BaseFindByIdDto, curUser): Promise<void> {
    const { id } = baseFindByIdDto;

    await this.commentRepository
      .createQueryBuilder()
      .update(Org)
      .set({ deleteStatus: 1, deleteBy: curUser ? curUser!.id : null, deleteTime: Utils.now() })
      .where('id = :id', { id: id })
      .execute();
  }

  /**
   * 删除（批量）
   */
  async deleteByIds(baseFindByIdsDto: BaseFindByIdsDto, curUser?): Promise<void> {
    let { ids } = baseFindByIdsDto;

    if (!Utils.isArray(ids)) {
      ids = Utils.split(ids.toString());
    }
    await this.commentRepository
      .createQueryBuilder()
      .update(Comment)
      .set({ deleteStatus: 1, deleteBy: curUser ? curUser!.id : null, deleteTime: Utils.now() })
      .where('id IN (:ids)', { ids: ids })
      .execute();
  }
}
