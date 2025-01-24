import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthApikeyStrategy } from './strategy';
import { AuthApiKeyMiddleware } from './middlewares';
import { User, Rol } from './entities';

@Module({
  controllers: [AuthController],
  providers: [AuthService, AuthApikeyStrategy, AuthApiKeyMiddleware],
  imports: [
    TypeOrmModule.forFeature([ User, Rol ]),
  ],
  exports: [TypeOrmModule]
})
export class AuthModule {}
