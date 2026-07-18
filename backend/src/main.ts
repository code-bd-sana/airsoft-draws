import { NestFactory } from '@nestjs/core';
import { ValidationPipe, BadRequestException, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import listEndpoints from 'express-list-endpoints';
import { AppModule } from './app.module';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    rawBody: true, // Required for Stripe Webhook signature verification
  });

  // Enable CORS for Next.js frontend with credentials support
  const allowedOrigins = [
    'http://localhost:3000',
    'https://airsoft-draws.vercel.app',
    process.env.FRONTEND_URL,
  ].filter(Boolean);

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
  });

  // Enable cookie parser
  app.use(cookieParser());

  // Global Exception Filter
  app.useGlobalFilters(new AllExceptionsFilter());

  // Global Response Interceptor
  app.useGlobalInterceptors(new TransformInterceptor());

  // Global Validation Pipe for class-validator
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      // Format validation errors to be industry standard
      exceptionFactory: (errors) => {
        const formattedErrors = errors.map((error) => ({
          field: error.property,
          errors: Object.values(error.constraints || {}),
        }));
        return new BadRequestException({
          message: 'Validation failed',
          error: formattedErrors,
        });
      },
    }),
  );

  // Configure Swagger API Documentation
  const config = new DocumentBuilder()
    .setTitle('Airsoft Draws API')
    .setDescription('The API documentation for Airsoft Draws Platform')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 5000);

  // Print all available API routes beautifully in the terminal
  const server = app.getHttpAdapter().getInstance();
  const endpoints = listEndpoints(server);
  
  const logger = new Logger('API_ROUTES');
  logger.log('========================================================');
  logger.log('🚀 AVAILABLE API ENDPOINTS:');
  logger.log('========================================================');
  endpoints.forEach((endpoint) => {
    endpoint.methods.forEach((method) => {
      // Exclude Swagger internal endpoints
      if (!endpoint.path.includes('swagger') && !endpoint.path.includes('/api/favicon') && !endpoint.path.includes('/api-json')) {
        logger.log(`[${method.padEnd(6)}] ${endpoint.path}`);
      }
    });
  });
  logger.log('========================================================');
  logger.log(`📝 Swagger Docs available at: http://localhost:${process.env.PORT ?? 5000}/api`);
}
bootstrap();
