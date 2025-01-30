import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { AuthModule } from './auth/auth.module';
import { AUTH_MS, envs, envSchema, USER_MS } from './config';
import { DatabaseModule } from './database/database.module';
import { AuthApiKeyMiddleware } from './auth/middlewares/auth-api-key.middleware';
import { CommonModule } from './common/common.module';
import { MailsModule } from './mails/mails.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: envSchema,
      isGlobal: true,
      load: [() => ({ envs })],
    }),
    DatabaseModule,

    // TODO: activar nats para comunicación entre microservicios
    // ClientsModule.register([
    //   { name: USER_MS, transport: Transport.NATS, options: { port: envs.NATS_PORT, url: envs.NATS_URL }},
    //   { name: AUTH_MS, transport: Transport.NATS, options: { port: envs.NATS_PORT, url: envs.NATS_URL }}
    // ]),

    AuthModule,
    CommonModule,
    MailsModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthApiKeyMiddleware)
      .exclude( '/auth/active-account', '/auth/public' )
      .forRoutes('*');
  }
}
