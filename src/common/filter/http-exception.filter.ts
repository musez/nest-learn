import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';
import dayjs = require('dayjs');
import { Logger } from '../../utils/log4js';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    const logFormat = ` <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
    Request original url: ${request.originalUrl}
    Method: ${request.method}
    IP: ${request.ip}
    Status code: ${status}
    Response: ${exception.toString()} \n  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
    `;
    Logger.info(logFormat);

    // 此刻的时间
    const nowDate = dayjs(Date.now()).format('YYYY-MM-DD HH:mm:ss');
    response.status(200).json({
      code: status,
      data: null,
      message: `${status >= 500 ? 'Service Error' : 'Client Error'}`,
      time: nowDate,
      path: request.url,
      error: exception.message,
    });
  }
}
