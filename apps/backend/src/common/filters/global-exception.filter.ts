import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger
} from "@nestjs/common";

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {

  private readonly logger = new Logger('GlobalException');

  catch(exception: unknown, host: ArgumentsHost) {

    const ctx = host.switchToHttp();
    const request = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : 500;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : exception;

    this.logger.error({
      path: request?.url,
      method: request?.method,
      status,
      message,
      stack: exception instanceof Error ? exception.stack : undefined,
    });

    throw exception;
  }
}