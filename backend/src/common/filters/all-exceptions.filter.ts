import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response, Request } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let errors = null;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      
      // If the exception response is an object (like validation errors)
      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        message = (exceptionResponse as any).message || message;
        errors = (exceptionResponse as any).error || null;
      } else {
        message = exceptionResponse as string;
      }
    } else {
      // Log unexpected errors
      console.error('Unhandled Exception:', exception);
    }

    response.status(status).json({
      success: false,
      message: Array.isArray(message) ? message[0] : message, // take the first message if it's an array
      errors: Array.isArray(message) ? message : errors, // if message is an array, it's likely validation errors
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }
}
