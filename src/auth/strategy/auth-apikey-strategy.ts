import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { HeaderAPIKeyStrategy } from 'passport-headerapikey';
import { AuthService } from '../auth.service';

@Injectable()
export class AuthApikeyStrategy extends PassportStrategy(HeaderAPIKeyStrategy) {
  constructor(private readonly authService: AuthService) {
    super({ header: 'x-api-key', prefix: '' }, false);
  }

  async validate(apikey: string): Promise<boolean> {
    return this.authService.validateApiKey(apikey);
  }
}
