import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';

import { Request, Response } from 'express';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { CreateUserDto } from './dtos/create-user.dto';
import { User } from './entities';
import { ForgotPasswordDto, LoginUserDto, LoginWithTokenDto, RefreshTokenDto, ResetPasswordDto } from './dtos';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { MailsService } from 'src/mails/mails.service';
import { envs } from 'src/config';
import { IncomingHttpHeaders } from 'http';
import { ExpiresIn } from './interfaces/expiresIn.type';

@Injectable()
export class AuthService {
  logger: Logger = new Logger('AuthService');

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly jwtService: JwtService,
    private readonly mailService: MailsService,
  ) {}

  async registerUser(createUserDto: CreateUserDto) {
    try {
      const { password, ...userData } = createUserDto;

      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10),
      });

      const newUser = await this.userRepository.save(user);
      delete newUser.password;

      // enviar email
      const token = this.jwtService.sign({ email: user.email, fullName: `${user.firstname} ${user.lastname}` }, { expiresIn: '24h' });
      const resEmail = await this.mailService.welcomeUser(`${user.firstname} ${user.lastname}`, user.email, token);
      if (!resEmail) throw new BadRequestException(['Error sending email']);

      return {
        data: {
          ...newUser,
          token: this.getJwtToken({ ...newUser }),
        },
        message: 'User created successfully, please check your email to activate your account',
      };
    } catch (error) {
      this.handleDBError(error);
    }
  }

  async activeAccount(token: string, res: Response) {
    try {
      const { email } = this.jwtService.verify(token, { secret: envs.JWT_SECRET }) as JwtPayload;

      const user = await this.userRepository.findOneBy({ email });

      if (!user) throw new NotFoundException('User not found');

      user.isActive = true;
      await this.userRepository.save(user);

      return res.redirect(302, `${envs.FRONTEND_URL}/sign-in`);
    } catch (error) {
      return res.status(400).json({ message: 'Error activating account', error });
    }
  }

  async loginUser({ email, password }: LoginUserDto) {
    this.logger.log(`Login user: ${email}`);
    const user = await this.userRepository.findOne({
      where: { email, isActive: true },
      select: { email: true, password: true, id: true, firstname: true, lastname: true, nickname: true },
    });

    if (!user)
      throw new BadRequestException('Invalid credentials (email)');
    if (!bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException('Invalid credentials (password)');

    delete user.password;

    const accessToken = this.getJwtToken({ ...user });
    const refreshToken = await this.createNewRefreshToken(user);

    this.logger.log(`login success: ${email}`);
    return {
      user,
      accessToken,
      refreshToken
    };
  }

  async loginWithToken({ token }: LoginWithTokenDto) {
    try {
      this.logger.log(`Login with token: ${token}`);
      const { email } = this.jwtService.verify(token, { secret: envs.JWT_SECRET }) as JwtPayload;
      const user = await this.userRepository.findOneBy({ email });

      if (!user) throw new NotFoundException('User not found');

      delete user.password;
      return {
        user,
        accessToken: this.getJwtToken({ ...user })
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  async createNewRefreshToken(user: User) {
    try {
      if (!user) throw new BadRequestException('User not found to refresh token');

      const userPresenter: RefreshTokenDto = {
        email: user.email,
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        nickname: user.nickname,
      };

      const refreshToken = this.getJwtToken({ ...userPresenter }, '30d');
      const hashRefreshToken = bcrypt.hashSync(refreshToken, 10);

      await this.userRepository.update(user.id, { refreshToken: hashRefreshToken });
      return refreshToken;
    } catch (error) {
      this.logger.error(error.message);
      throw new InternalServerErrorException('Error refreshing token');
    }
  }

  async refreshToken(headers: IncomingHttpHeaders) {
    const refreshToken = headers.authorization.split(' ')[1];
    if (!refreshToken) throw new UnauthorizedException('Refresh token required');

    const payload = this.jwtService.verify(refreshToken, { secret: envs.JWT_SECRET }) as JwtPayload;
    const user = await this.userRepository.findOneBy({ id: payload.id });

    if (!user.refreshToken) throw new UnauthorizedException('Invalid refresh token');

    const match = bcrypt.compareSync(refreshToken, user.refreshToken);
    if (!match) throw new UnauthorizedException('Invalid refresh token');

    delete user.password;
    return { accessToken: this.getJwtToken({ ...user }) };
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const { email } = forgotPasswordDto;

    const user = await this.userRepository.findOne({
      where: { email: email.trim() }
    });

    if (!user) return { message: 'If the email exists, we send an email to recover the password', email };

    // enviar email
    const token = this.jwtService.sign({ email: user.email, fullName: `${user.firstname} ${user.lastname}` }, { expiresIn: '5m' });
    const res = await this.mailService.forgotPassword(`${user.firstname} ${user.lastname}`, user.email, token);
    if (!res) throw new BadRequestException(['Error sending email']);

    return { message: 'If the email exists, we send an email to recover the password.' };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto, headers: IncomingHttpHeaders) {
    try {
      const { email, newPassword } = resetPasswordDto;

      const token = headers.authorization.split(' ')[1];
      const { email: tokenEmail } = this.jwtService.verify(token, { secret: envs.JWT_SECRET }) as JwtPayload;

      if (email !== tokenEmail) throw new UnauthorizedException('Invalid email');

      const user = await this.userRepository.findOne({
        where: { email: tokenEmail }
      });

      if (!user) throw new NotFoundException('User not found');

      user.password = bcrypt.hashSync(newPassword, 10);
      await this.userRepository.save(user);

      return { message: 'Password updated successfully' };
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  async logout(user: User) {
    try {
      await this.userRepository.update(user.id, { refreshToken: null });
      return { message: 'Logout successfully' };
    } catch (error) {
      this.logger.error(error.message);
      throw new InternalServerErrorException('Error refreshing token');
    }
  }


  private getJwtToken( payload: JwtPayload, expiresIn: ExpiresIn = '6h' ): string {
    return this.jwtService.sign( payload, { expiresIn });
  }

  handleDBError(error: any): never {
    this.logger.error(error.message);
    if (error.code === '23505') {
      if (error.detail.includes('email'.toLocaleUpperCase())) {
        throw new BadRequestException('email already exists');
      }
      throw new BadRequestException('nickname already exists');
    }
    throw new InternalServerErrorException(
      `Please check server logs for more details: ${error.message}, details: ${error.detail}`,
    );
  }
}
