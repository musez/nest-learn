import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateImportLogDto } from './dto/create-import-log.dto';
import { UpdateImportLogDto } from './dto/update-import-log.dto';
import { LimitImportLogDto } from './dto/limit-import-log.dto';
import { SearchImportLogDto } from './dto/search-import-log.dto';
import { Utils } from '../../utils';
import { ApiException } from '../../common/exception/api-exception';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ImportLog } from './entities/import-log.entity';
import { ApiErrorCode } from '../../constants/api-error-code.enum';

@Injectable()
export class ImportLogService {
  private readonly logger = new Logger(ImportLogService.name);

  constructor(
    @InjectRepository(ImportLog)
    private readonly importLogRepository: Repository<ImportLog>,
  ) {
  }

  /**
   * 添加
   */
  async insert(createImportLogDto: CreateImportLogDto, curUser?): Promise<CreateImportLogDto | void> {
    try {
      let importLog = new ImportLog();
      importLog = Utils.dto2entity(createImportLogDto, importLog);
      if (curUser) {
        importLog.createBy = curUser!.id;
      }

      const ret = await this.importLogRepository.save(importLog);

      if (ret) {
        return createImportLogDto;
      } else {
        throw new ApiException('保存异常！', ApiErrorCode.ERROR, HttpStatus.OK);
      }
    } catch (e) {
       throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  /**
   * 获取列表
   */
  async selectList(searchImportLogDto: SearchImportLogDto): Promise<any[]> {
    try {
      // eslint-disable-next-line prefer-const
      let { importType, status } = searchImportLogDto;

      const queryConditionList = [];
      if (!Utils.isBlank(importType)) {
        queryConditionList.push('importType LIKE :importType');
      }
      if (!Utils.isBlank(status)) {
        if (!Utils.isArray(status)) {
          // @ts-ignore
          status = Utils.split(status.toString());
        }
        queryConditionList.push('status IN (:status)');
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
        throw new ApiException('查询异常！', ApiErrorCode.ERROR, HttpStatus.OK);
      }

      return ret;
    } catch (e) {
       throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  /**
   * 获取列表（分页）
   */
  async selectListPage(limitImportLogDto: LimitImportLogDto): Promise<any> {
    try {
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
          // @ts-ignore
          status = Utils.split(status.toString());
        }
        queryConditionList.push('status IN (:status)');
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
        throw new ApiException('查询异常！', ApiErrorCode.ERROR, HttpStatus.OK);
      }

      return {
        list: ret[0],
        total: ret[1],
        page: page,
        limit: limit,
      };
    } catch (e) {
       throw new ApiException(e.errorMessage, e.errorCode ? e.errorCode : ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }
}
