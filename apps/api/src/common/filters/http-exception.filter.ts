import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse: any =
      exception instanceof HttpException ? exception.getResponse() : null;

    const message =
      typeof exceptionResponse === 'object' && exceptionResponse?.message
        ? exceptionResponse.message
        : exception instanceof Error
        ? exception.message
        : 'Internal Server Error';

    const errorName =
      typeof exceptionResponse === 'object' && exceptionResponse?.error
        ? exceptionResponse.error
        : exception instanceof HttpException
        ? exception.name
        : 'InternalServerError';

    this.logger.error(
      `HTTP ${status} [${request.method}] ${request.url} - ${JSON.stringify(message)}`,
    );

    response.status(status).json({
      success: false,
      statusCode: status,
      message,
      error: errorName,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
