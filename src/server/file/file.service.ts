import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFileDto } from './dto/create-file.dto';
import { File } from './entities/file.entity';
import { BaseFindByIdDto, BaseFindByIdsDto } from '../base.dto';
import { Utils } from '../../utils';
import { LimitFileDto } from './dto/limit-file.dto';
import * as url from 'url';
import * as qiniu from 'qiniu';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(File)
    private readonly fileRepository: Repository<File>,
    private readonly configService: ConfigService,
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
   * 七牛上传
   */
  async qiniuUpload(file, curUser): Promise<any> {
    const accessKey = this.configService.get('qiniu.accessKey');
    const secretKey = this.configService.get('qiniu.secretKey');
    const bucket = this.configService.get('qiniu.bucket');
    const domain = this.configService.get('qiniu.domain');

    // get token
    const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
    const putPolicy = new qiniu.rs.PutPolicy({
      scope: bucket,
    });
    const uploadToken = putPolicy.uploadToken(mac);

    // upload
    const formUploader = new qiniu.form_up.FormUploader(
      new qiniu.conf.Config({
        zone: qiniu.zone.Zone_z2,
      }),
    );

    return new Promise((_res, _rej) => {
      formUploader.put(uploadToken, `${Date.now()}-${encodeURI(file.originalname)}`, file.destination, new qiniu.form_up.PutExtra(), function(respErr, respBody, respInfo) {
          if (respErr) {
            console.error(respErr);
            throw new InternalServerErrorException(respErr.message);
          }

          if (respInfo.statusCode == 200) {
            console.log(respBody);
            _res({
              url: new url.URL(respBody.key, domain).href,
            });
          } else {
            console.error(respInfo.statusCode, respBody);
            throw new InternalServerErrorException(respInfo);
          }
        },
      );
    });
  }

  /**
   * 获取列表（分页）
   */
  async selectListPage(limitFileDto: LimitFileDto): Promise<any> {
    // eslint-disable-next-line prefer-const
    let { page, limit, originalName, fileDisName, status } = limitFileDto;
    page = page ? page : 1;
    limit = limit ? limit : 10;
    const offset = (page - 1) * limit;

    const queryConditionList = [];
    if (!Utils.isBlank(originalName)) {
      queryConditionList.push('originalName LIKE :originalName');
    }
    if (!Utils.isBlank(fileDisName)) {
      queryConditionList.push('fileDisName LIKE :fileDisName');
    }
    if (!Utils.isBlank(status)) {
      queryConditionList.push('status = :status');
    }
    queryConditionList.push('deleteStatus = 0');
    const queryCondition = queryConditionList.join(' AND ');

    const res = await this.fileRepository
      .createQueryBuilder()
      .where(queryCondition, {
        originalName: `%${originalName}%`,
        fileDisName: `%${fileDisName}%`,
        status: status,
      })
      .skip(offset)
      .take(limit)
      .orderBy({
        status: 'DESC',
        createTime: 'DESC',
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

    await this.fileRepository
      .createQueryBuilder()
      .update(File)
      .set({ deleteStatus: 1, deleteBy: curUser!.id, deleteTime: Utils.now() })
      .where('id = :id', { id: id })
      .execute();
  }

  /**
   * 删除（批量）
   */
  async deleteByIds(
    baseFindByIdsDto: BaseFindByIdsDto,
    curUser,
  ): Promise<void> {
    const { ids } = baseFindByIdsDto;
    const idsArr = Utils.split(ids);
    await this.fileRepository
      .createQueryBuilder()
      .update(File)
      .set({ deleteStatus: 1, deleteBy: curUser!.id, deleteTime: Utils.now() })
      .where('id in (:ids)', { ids: idsArr })
      .execute();
  }
}
