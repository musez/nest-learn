import { createHash, createCipher, createDecipher } from 'crypto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CryptoUtil {
  /**
   * 加密登录密码
   * @param password 登录密码
   */
  encryptPassword(password: string): string {
    return createHash('sha256')
      .update(password)
      .digest('hex');
  }

  /**
   * 检查登录密码是否正确
   * @param password 登录密码
   * @param encryptedPassword 库中加密后的密码
   */
  checkPassword(password: string, encryptedPassword): boolean {
    const currentPass = this.encryptPassword(password);
    return currentPass === encryptedPassword;
  }

  aesEncrypt(data, key) {
    const cipher = createCipher('aes192', key);
    let crypted = cipher.update(data, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
  }

  aesDecrypt(encrypted, key) {
    const decipher = createDecipher('aes192', key);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }
}
