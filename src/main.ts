import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
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
  await app.listen(envs.PORT);
  logger.log(`Server running on port ${envs.PORT}`)
}
bootstrap();
