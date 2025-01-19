import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { envs } from './config';

async function bootstrap() {
  const logger = new Logger('Main-Gateway')
  const app = await NestFactory.create(AppModule);

  app.enableCors(); // enable cors
  app.setGlobalPrefix('api'); // set global prefix

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // remove properties that do not have decorators dto
      forbidNonWhitelisted: true, // return error if properties that do not have decorators dto
      transform: true, // transform payload to dto if possible
      transformOptions: {
        enableImplicitConversion: true // convert types of properties to dto
      }
    })
  )

  const config = new DocumentBuilder()
    .setTitle('API Gateway')
    .setDescription('API Gateway for microservices architecture, with all controllers')
    .setVersion('0.0.1')
    .addTag('API Gateway')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('doc', app, document);

  await app.listen(envs.PORT);
  logger.log(`Server running on port ${envs.PORT}`)
}
bootstrap();
