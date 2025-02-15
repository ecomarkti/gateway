import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { HeaderAPIKeyStrategy } from 'passport-headerapikey';
import { AuthService } from '../auth.service';

@Injectable()
export class AuthApikeyStrategy extends PassportStrategy(HeaderAPIKeyStrategy) {
  private apikeys: string[] = ['1234567'];

  constructor(private readonly authService: AuthService) {
    super({ header: 'x-api-key', prefix: '' }, false);
    // TODO: validar como genera el gateway para traer los apikeys y guardarlos en cache.
  }

  validate(apikey: string): boolean {
    return this.apikeys.includes(apikey);
  }
}
