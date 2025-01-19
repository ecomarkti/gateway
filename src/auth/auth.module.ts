import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthApikeyStrategy } from './strategy/auth-apikey-strategy';
import { AuthApiKeyMiddleware } from './middlewares/auth-api-key.middleware';

@Module({
  controllers: [AuthController],
  providers: [AuthService, AuthApikeyStrategy, AuthApiKeyMiddleware],
})
export class AuthModule {}
