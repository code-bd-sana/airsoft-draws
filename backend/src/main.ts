import { NestFactory } from '@nestjs/core';
import { ValidationPipe, BadRequestException } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for Next.js frontend
  app.enableCors();

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
}
bootstrap();
