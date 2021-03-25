import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFileDto } from './dto/create-file.dto';
import { File } from './entities/file.entity';
import { BaseFindByIdDto, BasePageDto } from '../base.dto';
import { Utils } from '../../utils';
import { LimitArticleDto } from '../article/dto/limit-article.dto';

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(File)
    private readonly fileRepository: Repository<File>,
  ) {
  }

  /**
   * 添加
   */
  async insert(file, curUser?): Promise<CreateFileDto> {
    return await this.fileRepository.save(file);
  }

  /**
   * 添加（批量）
   */
  async batchInsert(files, curUser?): Promise<CreateFileDto[]> {
    return await this.fileRepository.save(files);
  }


  /**
   * 获取列表（分页）
   */
  async selectListPage(basePageDto: BasePageDto): Promise<any> {
    let { page, limit } = basePageDto;
    page = page ? page : 1;
    limit = limit ? limit : 10;
    let offset = (page - 1) * limit;

    let queryConditionList = [];

    let queryCondition = queryConditionList.join(' AND ');

    let res = await this.fileRepository.createQueryBuilder()
      .where(queryCondition, {})
      .skip(offset)
      .take(limit)
      .orderBy({
        'createTime': 'ASC',
      })
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
  async selectById(baseFindByIdDto: BaseFindByIdDto): Promise<CreateFileDto> {
    let { id } = baseFindByIdDto;
    return await this.fileRepository.findOne(id);
  }

  /**
   * 是否存在（主键 id）
   */
  async isExistId(id: string): Promise<Boolean> {
    let isExist = await this.fileRepository.findOne(id);
    if (Utils.isNil(isExist)) {
      throw false;
    } else {
      return true;
    }
  }

  /**
   * 获取（extId）
   */
  async selectByExtId(extId: string): Promise<CreateFileDto[]> {
    return await this.fileRepository.find({ extId: extId });
  }

  /**
   * 删除
   */
  async deleteById(baseFindByIdDto: BaseFindByIdDto): Promise<void> {
    let { id } = baseFindByIdDto;

    await this.fileRepository.createQueryBuilder()
      .delete()
      .from(File)
      .where('id = :id', { id: id })
      .execute();
  }
}
