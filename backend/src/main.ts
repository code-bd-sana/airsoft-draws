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
    origin: true, // This allows any origin dynamically (acting like *) while supporting credentials
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
  const serverUrl =
    process.env.APP_URL || `http://localhost:${process.env.PORT ?? 5000}`;

  const config = new DocumentBuilder()
    .setTitle('🎯 Airsoft Draws API Reference')
    .setDescription(
      'Welcome to the Airsoft Draws Platform API Documentation.\n\n' +
        'Here you can find all the public, client, host, and admin endpoints for managing ' +
        'raffles, purchasing tickets, processing payments, tracking winners, and managing subscriptions.\n\n' +
        '### 🔐 Authorization Modes\n' +
        '- **Bearer JWT**: Use the **Authorize** button with `Bearer <JWT_TOKEN>` for protected header authorization.\n' +
        '- **Cookie Auth**: The platform also supports the `accessToken` HTTP cookie for browser sessions.',
    )
    .setVersion('1.0')
    .addServer(serverUrl, 'Current API Server')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'JWT',
      description: 'Enter your JWT token to authorize protected API endpoints',
      in: 'header',
    })
    .addCookieAuth('accessToken', {
      type: 'apiKey',
      in: 'cookie',
      name: 'accessToken',
      description: 'HTTP-only JWT access token cookie',
    })
    .addTag('General', 'Platform health check and root endpoints')
    .addTag('Authentication', 'User authentication, registration, password recovery & email verification')
    .addTag('Users', 'User account profile, settings, avatar management & prize history')
    .addTag('Hosts', 'Host public profiles, host dashboard metrics, wallet balances & withdrawal requests')
    .addTag('Raffles', 'Competition creation, editing, hero metrics, live filters & winner draws')
    .addTag('Tickets', 'Ticket purchases, allocation algorithms, UKARA eligibility & user tickets')
    .addTag('Subscriptions', 'Host subscription tiers, quotas, manual requests & admin approvals')
    .addTag('Payment', 'Gateway checkout sessions (Cashflows/Stripe) & webhook event handlers')
    .addTag('Categories', 'Competition categories, slug resolution & category media')
    .addTag('Contact', 'Public contact inquiry form & administrative SMTP notifications')
    .addTag('Marketing Compliance', 'Advertising compliance reports & moderation review workflow')
    .addTag('Admin - Dashboard', 'System overview statistics, live platform activity & system logs')
    .addTag('Admin - Hosts', 'Host management, approval/rejection moderation & host metrics')
    .addTag('Admin - Orders', 'Ticket transaction records, financial statistics & refund operations')
    .addTag('Admin - Users', 'User directory, role management, and suspension toggles')
    .addTag('Admin - Winners', 'Winner KYC verification, ID document inspection & prize fulfillment')
    .addTag('Admin - Withdrawals', 'Host payout request review, approval, rejection & fee auditing')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Custom CSS to style Swagger UI and make it look premium (beautiful dark theme and clean layouts)
  const customCss = `
    .swagger-ui .topbar { background-color: #1a1f2c; border-bottom: 2px solid #00c8ff; }
    .swagger-ui .info .title { color: #00c8ff; font-family: 'Outfit', sans-serif; font-weight: 700; }
    .swagger-ui .info .title small { background-color: #00c8ff; color: #111; border-radius: 4px; padding: 2px 6px; }
    .swagger-ui .info p { font-size: 15px; line-height: 1.6; color: #b0c4de; }
    .swagger-ui .scheme-container { background: #1a1f2c; box-shadow: none; border-bottom: 1px solid #2e3748; padding: 15px 30px; }
    .swagger-ui .opblock.opblock-post { background: rgba(0, 240, 100, 0.05); border-color: rgba(0, 240, 100, 0.3); }
    .swagger-ui .opblock.opblock-get { background: rgba(0, 200, 255, 0.05); border-color: rgba(0, 200, 255, 0.3); }
    .swagger-ui .opblock.opblock-put { background: rgba(255, 170, 0, 0.05); border-color: rgba(255, 170, 0, 0.3); }
    .swagger-ui .opblock.opblock-patch { background: rgba(180, 0, 255, 0.05); border-color: rgba(180, 0, 255, 0.3); }
    .swagger-ui .opblock.opblock-delete { background: rgba(255, 50, 50, 0.05); border-color: rgba(255, 50, 50, 0.3); }
    .swagger-ui .opblock .opblock-summary-method { font-weight: 700; border-radius: 4px; }
    .swagger-ui .btn.authorize { background-color: #00c8ff !important; color: #111 !important; border-color: #00c8ff !important; font-weight: 700 !important; border-radius: 6px !important; }
    .swagger-ui .btn.authorize span { color: #111 !important; }
    .swagger-ui .btn.authorize svg { fill: #111 !important; }
    .swagger-ui select { border-radius: 6px; padding: 5px; }
    .swagger-ui input[type=text] { border-radius: 6px; padding: 8px 10px; }
  `;

  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'list',
      filter: true,
      displayRequestDuration: true,
      defaultModelsExpandDepth: 2,
    },
    customSiteTitle: 'Airsoft Draws API Reference',
    customCss: customCss,
  });

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
      if (
        !endpoint.path.includes('swagger') &&
        !endpoint.path.includes('/api/favicon') &&
        !endpoint.path.includes('/api-json')
      ) {
        logger.log(`[${method.padEnd(6)}] ${endpoint.path}`);
      }
    });
  });
  logger.log('========================================================');
  logger.log(
    `📝 Swagger Docs available at: http://localhost:${process.env.PORT ?? 5000}/api`,
  );
}
bootstrap();
