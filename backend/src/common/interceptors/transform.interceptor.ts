import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../interfaces/api-response.interface';

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    return next.handle().pipe(
      map((data) => ({
        success: true,
        message: data?.message || 'Request successful',
        data: data?.data !== undefined ? data.data : data, // Wrap the data securely
        meta: data?.meta !== undefined ? data.meta : undefined,
        timestamp: new Date().toISOString(),
      })),
    );
  }
}
