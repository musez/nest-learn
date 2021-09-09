import { Injectable } from '@nestjs/common';
import { CreateImportLogDto } from './dto/create-import-log.dto';
import { UpdateImportLogDto } from './dto/update-import-log.dto';
import { LimitImportLogDto } from './dto/limit-import-log.dto';
import { SearchImportLogDto } from './dto/search-import-log.dto';
import { Utils } from '../../utils';
import { ApiException } from '../../common/exception/api-exception';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ImportLog } from './entities/import-log.entity';

@Injectable()
export class ImportLogService {
  constructor(
    @InjectRepository(ImportLog)
    private readonly importLogRepository: Repository<ImportLog>,
  ) {
  }

  /**
   * 添加
   */
  async insert(createImportLogDto: CreateImportLogDto, curUser?): Promise<CreateImportLogDto | void> {
    let importLog = new ImportLog();
    importLog = Utils.dto2entity(createImportLogDto, importLog);
    if (curUser) {
      importLog.createBy = curUser!.id;
    }

    const ret = await this.importLogRepository.save(importLog);

    if (ret) {
      return createImportLogDto;
    } else {
      throw new ApiException('保存异常！', 500, 200);
    }
  }

  /**
   * 获取列表
   */
  async selectList(searchImportLogDto: SearchImportLogDto): Promise<any[]> {
    // eslint-disable-next-line prefer-const
    let { importType, status } = searchImportLogDto;

    const queryConditionList = [];
    if (!Utils.isBlank(importType)) {
      queryConditionList.push('importType LIKE :importType');
    }
    if (!Utils.isBlank(status)) {
      if (!Utils.isArray(status)) {
        status = Utils.split(status.toString());
      }
      queryConditionList.push('status IN (:...status)');
    }
    queryConditionList.push('deleteStatus = 0');
    const queryCondition = queryConditionList.join(' AND ');

    const ret = await this.importLogRepository
      .createQueryBuilder()
      .where(queryCondition, {
        importType: importType,
        status: status,
      })
      .orderBy({
        'status': 'DESC',
        'createTime': 'DESC',
      })
      .getRawMany();

    if (!ret) {
      throw new ApiException('查询异常！', 500, 200);
    }

    return ret;
  }

  /**
   * 获取列表（分页）
   */
  async selectListPage(limitImportLogDto: LimitImportLogDto): Promise<any> {
    // eslint-disable-next-line prefer-const
    let { page, limit, importType, status } = limitImportLogDto;
    page = page ? page : 1;
    limit = limit ? limit : 10;
    const offset = (page - 1) * limit;

    const queryConditionList = [];
    if (!Utils.isBlank(importType)) {
      queryConditionList.push('importType LIKE :importType');
    }
    if (!Utils.isBlank(status)) {
      if (!Utils.isArray(status)) {
        status = Utils.split(status.toString());
      }
      queryConditionList.push('status IN (:...status)');
    }
    queryConditionList.push('deleteStatus = 0');
    const queryCondition = queryConditionList.join(' AND ');

    const ret = await this.importLogRepository
      .createQueryBuilder('importLog')
      .where(queryCondition, {
        importType: importType,
        status: status,
      })
      .skip(offset)
      .take(limit)
      .orderBy({
        'status': 'DESC',
        'createTime': 'DESC',
      })
      .getManyAndCount();

    if (!ret) {
      throw new ApiException('查询异常！', 500, 200);
    }

    return {
      list: ret[0],
      total: ret[1],
      page: page,
      limit: limit,
    };
  }
}
