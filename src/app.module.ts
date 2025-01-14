import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { envs, envSchema } from './config';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: envSchema,
      isGlobal: true,
      load: [ () => ({ envs }) ]
    }),
    AuthModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
