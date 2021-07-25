import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFileDto } from './dto/create-file.dto';
import { File } from './entities/file.entity';
import { BaseFindByIdDto, BaseFindByIdsDto, BasePageDto } from '../base.dto';
import { Utils } from '../../utils';
import { LimitFileDto } from './dto/limit-file.dto';

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
  async insert(file, curUser): Promise<CreateFileDto> {
    return await this.fileRepository.save(file);
  }

  /**
   * 添加（批量）
   */
  async batchInsert(files, curUser): Promise<CreateFileDto[]> {
    return await this.fileRepository.save(files);
  }

  /**
   * 获取列表（分页）
   */
  async selectListPage(limitFileDto: LimitFileDto): Promise<any> {
    // eslint-disable-next-line prefer-const
    let { page, limit, originalName, fileDisName } = limitFileDto;
    page = page ? Number(page) : 1;
    limit = limit ? Number(limit) : 10;
    const offset = (page - 1) * limit;

    const queryConditionList = [];
    if (!Utils.isBlank(originalName)) {
      queryConditionList.push('originalName LIKE :originalName');
    }
    if (!Utils.isBlank(fileDisName)) {
      queryConditionList.push('fileDisName LIKE :fileDisName');
    }
    queryConditionList.push('deleteStatus = 0');
    const queryCondition = queryConditionList.join(' AND ');

    const res = await this.fileRepository.createQueryBuilder()
      .where(queryCondition, {
        originalName: `%${originalName}%`,
        fileDisName: `%${fileDisName}%`,
      })
      .skip(offset)
      .take(limit)
      .orderBy({
        'createTime': 'DESC',
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
    const { id } = baseFindByIdDto;
    return await this.fileRepository.findOne(id);
  }

  /**
   * 是否存在（主键 id）
   */
  async isExistId(id: string): Promise<boolean> {
    const isExist = await this.fileRepository.findOne(id);
    if (Utils.isNil(isExist)) {
      return false;
    } else {
      return true;
    }
  }

  /**
   * 获取列表（extId）
   */
  async selectByExtId(extId: string): Promise<CreateFileDto[]> {
    return await this.fileRepository.find({
      extId: extId,
      deleteStatus: 0,
    });
  }

  /**
   * 删除
   */
  async deleteById(baseFindByIdDto: BaseFindByIdDto, curUser): Promise<void> {
    const { id } = baseFindByIdDto;

    await this.fileRepository.createQueryBuilder()
      .update(File)
      .set({ deleteStatus: 1, deleteBy: curUser!.id, deleteTime: Utils.now() })
      .where('id = :id', { id: id })
      .execute();
  }

  /**
   * 删除（批量）
   */
  async deleteByIds(baseFindByIdsDto: BaseFindByIdsDto, curUser): Promise<void> {
    const { ids } = baseFindByIdsDto;

    await this.fileRepository.createQueryBuilder()
      .update(File)
      .set({ deleteStatus: 1, deleteBy: curUser!.id, deleteTime: Utils.now() })
      .where('id in (:ids)', { ids: ids })
      .execute();
  }
}
