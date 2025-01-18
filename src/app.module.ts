import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { AuthModule } from './auth/auth.module';
import { AUTH_MS, envs, envSchema, USER_MS } from './config';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: envSchema,
      isGlobal: true,
      load: [ () => ({ envs }) ]
    }),
    DatabaseModule,
    

    // ClientsModule.register([
    //   { name: USER_MS, transport: Transport.NATS, options: { port: envs.NATS_PORT, url: envs.NATS_URL }},
    //   { name: AUTH_MS, transport: Transport.NATS, options: { port: envs.NATS_PORT, url: envs.NATS_URL }}
    // ]),

    // AuthModule
  ],
})
export class AppModule {}
