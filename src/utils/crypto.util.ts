import { randomBytes, createHash, createCipher, createDecipher } from 'crypto';

export class CryptoUtil {
  // 随机盐
  static makeSalt(): string {
    return randomBytes(3).toString('base64');
  }

  /**
   * 加密登录密码
   * @param password 登录密码
   * @returns string 加密字符串
   */
  static encryptPassword(password: string): string {
    return createHash('sha256').update(password).digest('hex');
  }

  /**
   * 检查登录密码是否正确
   * @param password 登录密码
   * @param encryptedPassword 库中加密后的密码
   * @returns boolean 是否匹配
   */
  static checkPassword(password: string, encryptedPassword): boolean {
    const currentPass = this.encryptPassword(password);
    return currentPass === encryptedPassword;
  }

  /**
   * 对称加密加密
   * @param data 数据
   * @param key 加密 key
   * @returns string 加密字符串
   */
  static aesEncrypt(data, key) {
    const cipher = createCipher('aes192', key);
    let crypted = cipher.update(data, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
  }

  /**
   * 对称加密解密
   * @param encrypted 加密字符串
   * @param key 加密 key
   * @returns string 解密字符串
   */
  static aesDecrypt(encrypted, key) {
    const decipher = createDecipher('aes192', key);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }
}
