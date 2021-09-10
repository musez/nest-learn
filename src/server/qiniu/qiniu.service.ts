import { HttpStatus, Injectable } from '@nestjs/common';
import { ApiException } from '../../common/exception/api-exception';
import { ConfigService } from '@nestjs/config';
// @ts-ignore
import * as qiniu from 'qiniu';
import { BaseQiniuDto } from './dto/base-qiniu.dto';
import { FileService } from '../file/file.service';
import { BaseFindByIdDto } from '../base.dto';
import { ApiErrorCode } from '../../constants/api-error-code.enum';

@Injectable()
export class QiniuService {
  constructor(
    private readonly configService: ConfigService,
    private readonly fileService: FileService,
  ) {
  }

  /**
   * 获取配置文件
   */
  async getConfig(): Promise<any> {
    try {
      return this.configService.get('qiniu');
    } catch (e) {
      throw new ApiException('获取配置失败！', ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  /**
   * 产生七牛的 token
   */
  async createToken(): Promise<any> {
    const qiniuConfig = await this.getConfig();
    try {
      const mac = new qiniu.auth.digest.Mac(qiniuConfig.accessKey, qiniuConfig.secretKey);
      const putPolicy = new qiniu.rs.PutPolicy({
        scope: qiniuConfig.bucket,
        expires: Number(qiniuConfig.expires),
      });
      return await putPolicy.uploadToken(mac);
    } catch (e) {
      throw new ApiException('生成 token 失败！', ApiErrorCode.ERROR, HttpStatus.OK);
    }
  }

  /**
   * 七牛上传（单）
   */
  async upload(file, body, curUser?): Promise<any> {
    const qiniuConfig = await this.getConfig();

    // get token
    const mac = new qiniu.auth.digest.Mac(qiniuConfig.accessKey, qiniuConfig.secretKey);
    const putPolicy = new qiniu.rs.PutPolicy({
      scope: qiniuConfig.bucket,
    });
    const uploadToken = putPolicy.uploadToken(mac);
    const config = new qiniu.conf.Config({
      zone: qiniu.zone.Zone_z2,
    });

    // upload
    const formUploader = new qiniu.form_up.FormUploader(config);
    const putExtra = new qiniu.form_up.PutExtra();

    const fileName = `${encodeURI(file.filename)}`;
    const filePath = `${file.destination}/${file.filename}`;

    return new Promise((_res, _rej) => {
      try {
        formUploader.putFile(
          uploadToken,
          fileName,
          filePath,
          putExtra,
          async (respErr, respBody, respInfo) => {
            if (respErr) {
              console.error(respErr);
              throw new ApiException(respErr.message, ApiErrorCode.ERROR, HttpStatus.OK);
            }

            if (respInfo.statusCode == 200) {
              const privateBucketDomain = qiniuConfig.domain;
              const bucketManager = new qiniu.rs.BucketManager(mac, config);
              const deadline = parseInt(String(Date.now() / 1000)) + 3600;

              // 获取地址
              file.key = respBody.key;
              file.fileUrl = bucketManager.privateDownloadUrl(privateBucketDomain, respBody.key, deadline);
              file.type = 1;
              const ret = await this.fileService.insert(file, body, curUser);
              _res(ret);
            } else {
              throw new ApiException(respInfo, respInfo.statusCode, HttpStatus.OK);
            }
          },
        );
      } catch (e) {
        console.log(e);
        _rej(e);
      }
    });
  }

  /**
   * 七牛上传（多）
   */
  async uploads(files, body, curUser?): Promise<any> {
    const qiniuConfig = await this.getConfig();

    // get token
    const mac = new qiniu.auth.digest.Mac(qiniuConfig.accessKey, qiniuConfig.secretKey);
    const putPolicy = new qiniu.rs.PutPolicy({
      scope: qiniuConfig.bucket,
    });
    const uploadToken = putPolicy.uploadToken(mac);
    const config = new qiniu.conf.Config({
      zone: qiniu.zone.Zone_z2,
    });

    // upload
    const formUploader = new qiniu.form_up.FormUploader(config);
    const putExtra = new qiniu.form_up.PutExtra();

    return new Promise((_res, _rej) => {
      try {
        const results = [];
        console.log();
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const fileName = `${encodeURI(file.filename)}`;
          const filePath = `${file.destination}/${file.filename}`;

          formUploader.putFile(
            uploadToken,
            fileName,
            filePath,
            putExtra,
            async (respErr, respBody, respInfo) => {
              if (respErr) {
                console.error(respErr);
                throw new ApiException(respErr.message, ApiErrorCode.ERROR, HttpStatus.OK);
              }

              if (respInfo.statusCode == 200) {
                const privateBucketDomain = qiniuConfig.domain;
                const bucketManager = new qiniu.rs.BucketManager(mac, config);
                const deadline = parseInt(String(Date.now() / 1000)) + 3600;

                // 获取地址
                file.key = respBody.key;
                file.fileUrl = bucketManager.privateDownloadUrl(privateBucketDomain, respBody.key, deadline);
                file.type = 1;
                results.push(file);
                if (results.length === files.length) {
                  console.log('results', results);
                  const ret = await this.fileService.insertBatch(results, body, curUser);
                  _res(ret);
                }
              } else {
                throw new ApiException(respInfo, respInfo.statusCode, HttpStatus.OK);
              }
            },
          );
        }
      } catch (e) {
        console.log(e);
        _rej(e);
      }
    });
  }

  /**
   * 详情
   */
  async selectById(baseFindByIdDto: BaseFindByIdDto): Promise<any> {
    const { key } = await this.fileService.selectById(baseFindByIdDto);

    return this.selectByKey(key);
  }

  /**
   * 七牛获取
   */
  async selectByKey(key: string): Promise<any> {
    const qiniuConfig = await this.getConfig();

    const mac = new qiniu.auth.digest.Mac(qiniuConfig.accessKey, qiniuConfig.secretKey);
    const config = new qiniu.conf.Config({
      zone: qiniu.zone.Zone_z2,
    });
    const bucketManager = new qiniu.rs.BucketManager(mac, config);

    return new Promise((_res, _rej) => {
      bucketManager.stat(
        qiniuConfig.bucket,
        key,
        function(err, respBody, respInfo) {
          if (err) {
            console.log(err);
            throw new ApiException('获取异常！', ApiErrorCode.ERROR, HttpStatus.OK);
          }

          if (respInfo.statusCode == 200) {
            console.log('respBody', respBody);
            _res(respBody);
          } else {
            console.log(respInfo, respBody);
            throw new ApiException(respBody.error, respInfo.statusCode, HttpStatus.OK);
          }
        });
    });
  }

  /**
   * 七牛下载
   */
  async download(baseQiniuDto: BaseQiniuDto): Promise<any> {
    const qiniuConfig = await this.getConfig();

    const { key } = baseQiniuDto;
    const mac = new qiniu.auth.digest.Mac(qiniuConfig.accessKey, qiniuConfig.secretKey);
    const config = new qiniu.conf.Config();
    const bucketManager = new qiniu.rs.BucketManager(mac, config);
    const privateBucketDomain = qiniuConfig.domain;
    const deadline = parseInt(String(Date.now() / 1000)) + 3600; // 1小时过期
    const privateDownloadUrl = bucketManager.privateDownloadUrl(privateBucketDomain, key, deadline);
    return privateDownloadUrl;
  }
}
