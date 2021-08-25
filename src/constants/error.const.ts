import { UserConstants } from './swagger.const';

class CodeAndMsg {
  CODE: number;
  MESSAGE: string;
}

export class ErrorCode {
  static readonly TIMEOUT: CodeAndMsg = { CODE: -1, MESSAGE: '系统繁忙！' };
  static readonly SUCCESS: CodeAndMsg = { CODE: 200, MESSAGE: '请求成功！' };
  static readonly ERROR: CodeAndMsg = { CODE: 500, MESSAGE: '请求失败！' };
  static readonly ParamsError: CodeAndMsg = {
    CODE: 400,
    MESSAGE: '参数错误！',
  };

  static readonly Forbidden: CodeAndMsg = {
    CODE: 403,
    MESSAGE: '没有权限执行此操作！',
  };
  static readonly NotFound: CodeAndMsg = {
    CODE: 404,
    MESSAGE: '找不到请求的资源！',
  };

  static readonly LoginError: CodeAndMsg = {
    CODE: 1000,
    MESSAGE: '用户名或密码错误！',
  };
  static readonly LoginTimeout: CodeAndMsg = {
    CODE: 1001,
    MESSAGE: '登录超时！',
  };
  static readonly InActive: CodeAndMsg = {
    CODE: 1002,
    MESSAGE: '账号未激活！',
  };

  static readonly TokenError: CodeAndMsg = {
    CODE: 1003,
    MESSAGE: 'token 错误！',
  };
  static readonly Frozen: CodeAndMsg = { CODE: 1004, MESSAGE: '账号已冻结！' };

  static readonly InvalidUserName: CodeAndMsg = {
    CODE: 1005,
    MESSAGE: `用户名 格式不正确，需要是 ${UserConstants.USERNAME_MIN_LENGTH} 到 ${UserConstants.USERNAME_MAX_LENGTH} 个字符，只能包含英文、中文、下划线，不能包含空格！`,
  };

  static readonly InvalidPhone: CodeAndMsg = {
    CODE: 1006,
    MESSAGE: '无效的手机号！',
  };
  static readonly InvalidCaptcha: CodeAndMsg = {
    CODE: 1007,
    MESSAGE: '验证码无效或已过期，请重新发送验证码！',
  };

  static readonly InvalidPassword: CodeAndMsg = {
    CODE: 1008,
    MESSAGE: `密码需要是 ${UserConstants.PASSWORD_MIN_LENGTH} 到 ${UserConstants.PASSWORD_MAX_LENGTH} 个字符之间！`,
  };

  static readonly UserNameExists: CodeAndMsg = {
    CODE: 1009,
    MESSAGE: '用户名已存在！',
  };
  static readonly PhoneExists: CodeAndMsg = {
    CODE: 1010,
    MESSAGE: '手机号已存在！',
  };
  static readonly UserIdNotExists: CodeAndMsg = {
    CODE: 1011,
    MESSAGE: '用户不存在！',
  };

  static CodeToMessage(code: number): string {
    for (const key of Object.keys(this)) {
      if (this[key].CODE === code) {
        return this[key].MESSAGE;
      }
    }
    return '';
  }

  static HasCode(code: number): boolean {
    for (const key of Object.keys(this)) {
      if (this[key].CODE === code) {
        return true;
      }
    }
    return false;
  }
}
