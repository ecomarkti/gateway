import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthApikeyStrategy, JwtStrategy } from './strategies';
import { AuthApiKeyMiddleware } from './middlewares';
import { User, Rol, ApiKey } from './entities';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { envs } from 'src/config';
import { MailsModule } from 'src/mails/mails.module';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthApikeyStrategy,
    AuthApiKeyMiddleware,
    JwtStrategy,
  ],
  imports: [
    TypeOrmModule.forFeature([User, Rol, ApiKey]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: envs.JWT_SECRET,
        signOptions: { expiresIn: '4h' },
      }),
    }),
    MailsModule,
  ],
  exports: [TypeOrmModule, JwtStrategy, PassportModule, JwtModule],
})
export class AuthModule {}
