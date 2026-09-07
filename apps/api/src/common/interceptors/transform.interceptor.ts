import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  timestamp: string;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    const statusCode = response.statusCode;

    return next.handle().pipe(
      map((data) => {
        let message = 'Operation successful';
        let actualData = data;

        if (data && typeof data === 'object' && 'message' in data && 'data' in data) {
          message = data.message;
          actualData = data.data;
        }

        return {
          success: true,
          statusCode,
          message,
          data: actualData,
          timestamp: new Date().toISOString(),
        };
      }),
    );
  }
}
