import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';
import { envs } from 'src/config';

@Injectable()
export class MailsService {
  logger = new Logger('MailsService');

  constructor(
    private readonly mailerService: MailerService,
  ) {}

  async forgotPassword(userName: string, email: string, token: string) {
    try {
      const resEmail = await this.mailerService.sendMail({
        to: email,
        subject: 'Forgot Password',
        template: './forgot-password',
        context: {
          name: userName,
          url: `${envs.FRONTEND_URL}/reset-password?token=${token}`,
        }
      });

      const response = resEmail.accepted.length === 0 ? false : true;
      return response;
    } catch (error) {
      this.logger.error('Error sending email', error);
      throw new InternalServerErrorException('Error sending email');
    }
  }

  async welcomeUser(userName: string, email: string, token: string) {
    try {
      const resEmail = await this.mailerService.sendMail({
        to: email,
        subject: 'Welcome - Active Account',
        template: './welcome', // Asegúrate de que esta ruta sea correcta
        context: {
          name: userName,
          url: `${envs.HOST}${envs.PORT}/api/auth/active-account?token=${token}`,
          apiKey: '1234567',
          token,
        }
      });

      const response = resEmail.accepted.length === 0 ? false : true;
      return response;
    } catch (error) {
      this.logger.error('Error sending email', error);
      throw new InternalServerErrorException('Error sending email');
    }
  }
}
