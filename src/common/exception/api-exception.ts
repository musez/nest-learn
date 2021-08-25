import { HttpException, HttpStatus } from '@nestjs/common';
import { ApiErrorCode } from '../../constants/api-error-code.enum';

/**
 * 定义 API 异常类
 *
 * @export
 * @class ApiException
 * @extends {HttpException}
 */
export class ApiException extends HttpException {
  private errorMessage: string;
  private errorCode: ApiErrorCode;

  constructor(errorMessage: string, errorCode: ApiErrorCode) {
    super({ errorCode, errorMessage }, HttpStatus.OK);
    this.errorMessage = errorMessage;
    this.errorCode = errorCode;
  }

  getErrorCode(): ApiErrorCode {
    return this.errorCode;
  }

  getErrorMessage(): string {
    return this.errorMessage;
  }
}
