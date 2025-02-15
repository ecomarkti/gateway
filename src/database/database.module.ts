import fs from 'fs';
import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from 'pg';
import { envs } from 'src/config';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('POSTGRES_HOST'),
        port: +configService.get('POSTGRES_PORT'),
        username: configService.get('POSTGRES_USER'),
        password: configService.get('POSTGRES_PASSWORD'),
        database: configService.get('POSTGRES_DB'),
        autoLoadEntities: true,
        poolSize: 10,
        extra: {
          keepAlive: true, // Mantiene la conexión activa
          idleTimeoutMillis: 30000, // Cierra conexiones inactivas después de 30s
          connectionTimeoutMillis: 5000, // Espera 5s antes de descartar la conexión
        },
        ssl:
          configService.get('APP_ENV') === 'production'
            ? {
                ca: fs.readFileSync('path/to/ca.crt').toString(),
                key: fs.readFileSync('path/to/client.key').toString(),
                cert: fs.readFileSync('path/to/client.crt').toString(),
              }
            : {
                rejectUnauthorized: false,
              },
        synchronize:
          configService.get('APP_ENV') === 'development' ? true : false,
      }),
    }),
  ],
  providers: [
    {
      provide: 'PG',
      useFactory: () => {
        const {
          POSTGRES_DB,
          POSTGRES_HOST,
          POSTGRES_PASSWORD,
          POSTGRES_PORT,
          POSTGRES_USER,
          APP_ENV,
        } = envs;
        const client = new Client({
          user: POSTGRES_USER,
          host: POSTGRES_HOST,
          database: POSTGRES_DB,
          password: POSTGRES_PASSWORD,
          port: POSTGRES_PORT,
          ssl:
            APP_ENV === 'production'
              ? {
                  ca: fs.readFileSync('path/to/ca.crt').toString(),
                  key: fs.readFileSync('path/to/client.key').toString(),
                  cert: fs.readFileSync('path/to/client.crt').toString(),
                }
              : {
                  rejectUnauthorized: false,
                },
        });
        client.connect();
        return client;
      },
    },
    // EJEMPLO DE COMO INYECTAR @Inject('PG') private clientPg: Client,
    // EJEMPLO DE COMO USAR clientPg.query('SELECT NOW()', (err, res) => { console.log(err, res.rows) })
  ],
  exports: [TypeOrmModule, 'PG'],
})
export class DatabaseModule {}
