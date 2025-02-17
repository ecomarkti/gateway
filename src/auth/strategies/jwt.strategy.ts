import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { envs } from 'src/config';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy( Strategy ) {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

  ) {
    super({
      secretOrKey: envs.JWT_SECRET,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      passReqToCallback: true,
    });
  }

  async validate( payload: JwtPayload ): Promise<User> {
    const { id } = payload;

    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['rol'],
    });

    if ( !user )
      throw new UnauthorizedException('Token not valid');

    if ( !user.isActive )
      throw new UnauthorizedException('User is inactive, talk with an admin');

    return user;
  }
}
