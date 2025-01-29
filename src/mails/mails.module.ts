import { join } from 'path';

import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

import { MailsService } from './mails.service';
import { envs } from 'src/config';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          host: envs.MAIL_HOST,
          port: Number(envs.MAIL_PORT),
          secure: true,
          auth: {
            user: envs.MAIL_USER,
            pass: envs.MAIL_PASSWORD,
          },
        },
        defaults: {
          from: `"EcoMark Solutions Tech" <${envs.MAIL_USER}>`,
        },
        template: {
          dir: join(__dirname, './templates'), // !para que funcione bien se debe agregar alnest-cli.json -> "compilerOptions":{"assets":[{"include":"mails/templates/**/*.hbs"}]}
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
  ],
  providers: [MailsService],
  exports: [MailsService],
})
export class MailsModule {}

// documentaciones
// https://nest-modules.github.io/mailer/docs/mailer.html#install
// https://github.com/yanarp/nestjs-mailer
// https://my.stripo.email/
