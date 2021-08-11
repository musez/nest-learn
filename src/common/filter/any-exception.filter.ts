/**
 * 捕获所有异常
 */
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import dayjs = require('dayjs');
import { Logger } from '../../utils/log4js';
import { ApiException } from '../exception/api-exception';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    // const logFormat = ` <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
    // Request original url: ${request.originalUrl}
    // Method: ${request.method}
    // IP: ${request.ip}
    // Status code: ${status}
    // Response: ${exception} \n  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
    // `;
    // Logger.error(logFormat);

    // 此刻的时间
    const nowDate = dayjs(Date.now()).format('YYYY-MM-DD HH:mm:ss');
    response.status(200).json({
      code: status,
      data: null,
      message: `Service Error: ${exception}`,
      time: nowDate,
      path: request.url,
    });
  }
}
