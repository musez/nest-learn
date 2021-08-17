export enum ApiErrorCode {
  TIMEOUT = -1, // 系统繁忙
  SUCCESS = 200, // 成功
  ERROR = 500, // 失败

  PARAMS_ERROR = 400, // 参数错误
  FORBIDDEN = 401, // 没有权限执行此操作
  NOT_FOUND = 404, // 找不到请求的资源

  LOGIN_ERROR = 1000, // 用户名或密码错误
  LOGIN_TIMEOUT = 1001, // 登录超时
  IN_ACTIVE = 1002, // 账号未激活

  TOKEN_ERROR = 1003, // token 错误
  FROZEN = 1004, // 账号已冻结

  INVALID_USER_NAME = 1005, // 用户名格式不正确
  INVALID_PHONE = 1006, // 无效的手机号
  INVALID_CAPTCHA = 1007, // 验证码无效或已过期
  INVALID_PASSWORD = 1008, // 密码无效

  USER_NAME_EXISTS = 1009, // 用户名已存在
  PHONE_EXISTS = 1010, // 手机号已存在
  USER_ID_NOT_EXISTS = 1011, // 用户不存在
}
