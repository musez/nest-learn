import { Injectable } from '@nestjs/common';
import { ApiException } from '../../common/exception/api-exception';
import { ConfigService } from '@nestjs/config';
// @ts-ignore
import * as qiniu from 'qiniu';
import { BaseQiniuDto } from './dto/base-qiniu.dto';

@Injectable()
export class QiniuService {
  constructor(
    private readonly configService: ConfigService,
  ) {
  }

  /**
   * 获取配置文件
   */
  public async getConfig() {
    try {
      return this.configService.get('qiniu');
    } catch (e) {
      throw new ApiException('获取配置失败！', 500);
    }
  }

  /**
   * 产生七牛的 token
   */
  public async createToken() {
    const qiniuConfig = this.configService.get('qiniu');
    try {
      const mac = new qiniu.auth.digest.Mac(qiniuConfig.accessKey, qiniuConfig.secretKey);
      const putPolicy = new qiniu.rs.PutPolicy({
        scope: qiniuConfig.bucket,
        expires: Number(qiniuConfig.expires),
      });
      const uploadToken = await putPolicy.uploadToken(mac);
      return { success: true, upToken: uploadToken };
    } catch (e) {
      return { success: false, upToken: '' };
    }
  }

  /**
   * 七牛上传
   */
  async upload(file, curUser): Promise<any> {
    const qiniuConfig = this.configService.get('qiniu');

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
      formUploader.putFile(
        uploadToken,
        fileName,
        filePath,
        putExtra,
        function(respErr, respBody, respInfo) {
          if (respErr) {
            console.error(respErr);
            throw new ApiException(respErr.message, 500);
          }

          if (respInfo.statusCode == 200) {
            const privateBucketDomain = qiniuConfig.domain;
            const bucketManager = new qiniu.rs.BucketManager(mac, config);
            const deadline = parseInt(String(Date.now() / 1000)) + 3600;
            console.log('respBody', respBody);
            console.log('respInfo', respInfo);
            _res(bucketManager.privateDownloadUrl(privateBucketDomain, respBody.key, deadline));
          } else {
            console.error(respInfo.statusCode, respBody);
            throw new ApiException(respInfo, respInfo.statusCode);
          }
        },
      );
    });
  }

  /**
   * 七牛下载
   */
  async download(baseQiniuDto: BaseQiniuDto): Promise<any> {
    const { key } = baseQiniuDto;
    const qiniuConfig = this.configService.get('qiniu');

    const mac = new qiniu.auth.digest.Mac(qiniuConfig.accessKey, qiniuConfig.secretKey);
    const config = new qiniu.conf.Config();
    const bucketManager = new qiniu.rs.BucketManager(mac, config);
    const privateBucketDomain = qiniuConfig.domain;
    const deadline = parseInt(String(Date.now() / 1000)) + 3600; // 1小时过期
    const privateDownloadUrl = bucketManager.privateDownloadUrl(privateBucketDomain, key, deadline);
    return privateDownloadUrl;
  }

  /**
   * 七牛获取
   */
  async selectByKey(baseQiniuDto: BaseQiniuDto): Promise<any> {
    const { key } = baseQiniuDto;
    const qiniuConfig = this.configService.get('qiniu');

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
            throw new ApiException('获取异常！', 500);
          }

          if (respInfo.statusCode == 200) {
            console.log('respBody', respBody);
            _res(respBody);
          } else {
            console.log(respInfo, respBody);
            throw new ApiException(respBody.error, respInfo.statusCode);
          }
        });
    });
  }
}
