import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Logger } from '../../utils/log4js';

interface Response<T> {
  data: T;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    // const req = context.getArgByIndex(1).req;
    return next.handle().pipe(
      map((data) => {
        // const logFormat = ` <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
        // Request original url: ${req.originalUrl}
        // Method: ${req.method}
        // IP: ${req.ip}
        // User: ${JSON.stringify(req.user)}
        // Response data:\n ${JSON.stringify(data)}
        // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<`;
        // Logger.info(logFormat);
        // Logger.access(logFormat);

        return {
          data,
          code: 200,
          message: '请求成功！',
        };
      }),
    );
  }
}
