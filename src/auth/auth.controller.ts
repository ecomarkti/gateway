import { Body, Controller, Get, Headers, Logger, Post, Query, Res } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { Response } from 'express';
import { IncomingHttpHeaders } from 'http';

import { AuthService } from './auth.service';
import { Auth, GetUser } from './decorators';
import { CreateUserDto, ForgotPasswordDto, LoginUserDto, ResetPasswordDto } from './dto';
import { User } from './entities';

@Controller('auth')
export class AuthController {
  logger = new Logger('AuthController');
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiResponse({ status: 201, description: 'User created', type: User })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async registerUser(@Body() createUserDto: CreateUserDto) {
    return await this.authService.registerUser(createUserDto);
  }

  @Get('active-account')
  async activeAccount(
    @Query('token') token: string,
    @Res() res: Response,
  ) {
    return this.authService.activeAccount(token, res);
  }

  @Post('login')
  async loginUser(
    @Body() loginUserDto: LoginUserDto
  ) {
    return await this.authService.loginUser(loginUserDto);
  }

  @Post('refresh-token')
  @Auth()
  async refreshToken(
    @Headers() headers: IncomingHttpHeaders
  ) {
    return await this.authService.refreshToken(headers);
  }

  @Post('forgot-password')
  forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Post('reset-password')
  @Auth()
  resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
    @Headers() headers: IncomingHttpHeaders,
  ) {
    return this.authService.resetPassword(resetPasswordDto, headers);
  }

  @Get('logout')
  @Auth()
  logout(
    @GetUser() user: User
  ) {
    return this.authService.logout(user);
  }



  @Get('public')
  async public() {
    return 'Hello public';
  }
}
