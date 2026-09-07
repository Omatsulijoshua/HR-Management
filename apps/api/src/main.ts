import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  const apiPrefix = process.env.API_PREFIX || '/api/v1';
  const port = process.env.PORT || 4000;

  // Set global prefix (e.g. /api/v1)
  const normalizedPrefix = apiPrefix.startsWith('/') ? apiPrefix.substring(1) : apiPrefix;
  app.setGlobalPrefix(normalizedPrefix);

  // Enable CORS
  app.enableCors({
    origin: '*',
    credentials: true,
  });

  // Global pipes & filters
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new TransformInterceptor());

  // Swagger OpenAPI configuration
  const config = new DocumentBuilder()
    .setTitle('HR Management & HCM SaaS Platform API')
    .setDescription('Production-ready REST API for Multi-Tenant Enterprise HRMS/HCM Platform')
    .setVersion('1.0')
    .addBearerAuth()
    .addApiKey({ type: 'apiKey', name: 'x-organization-id', in: 'header' }, 'x-organization-id')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(port);
  logger.log(`🚀 API Application is running on: http://localhost:${port}/${normalizedPrefix}`);
  logger.log(`📚 Swagger Documentation is available at: http://localhost:${port}/api/docs`);
}

bootstrap();
