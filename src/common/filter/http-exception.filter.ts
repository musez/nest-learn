import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import dayjs = require('dayjs');
import { Logger } from '../../utils/log4js.util';
import { ApiException } from '../exception/api-exception';

// 捕获请求异常类型
// 可以传递多个参数，所以你可以通过逗号分隔来为多个类型的异常设置过滤器。
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    // 把请求相关的参数转成标准 http 的上下文
    // 有兴趣可以点进去，GPRC，WEBSOCKET 都能直接转换
    // 也能直接拿到一些参数的及返回上下文类型
    const ctx = host.switchToHttp();
    // 响应体
    const response = ctx.getResponse<Response>();
    // 请求体
    const request = ctx.getRequest<Request>();
    // 判断状态是否为请求异常,否则直接抛回来服务内部错误
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const logFormat = ` <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
    Request original url: ${request.originalUrl}
    Method: ${request.method}
    IP: ${request.ip}
    Status code: ${status}
    Response: ${exception.toString()} \n  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
    `;
    Logger.error(logFormat);

    // 此刻的时间
    const nowDate = dayjs(Date.now()).format('YYYY-MM-DD HH:mm:ss');

    if (exception instanceof ApiException) {
      response.status(200).json({
        code: exception.getErrorCode(),
        data: null,
        message: exception.getErrorMessage(),
        time: nowDate,
        path: request.url,
        error: exception.getErrorMessage(),
      });
    } else {
      response.status(200).json({
        code: status,
        data: null,
        message: `${status >= 500 ? '服务端错误：' : '客户端错误：'}${exception.message}！`,
        time: nowDate,
        path: request.url,
        error: exception.toString(),
      });
    }
  }
}
