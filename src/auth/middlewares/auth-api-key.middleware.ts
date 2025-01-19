import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

import * as passport from 'passport';

@Injectable()
export class AuthApiKeyMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('Middleware: Autenticación');
    passport.authenticate('headerapikey', { session: false }, (err, user) => {
      console.log('Middleware Autenticación', err, user);
      if (err || !user) {
        return res.status(401).json({ message: 'Invalid API Key' });
      }

      return next();
    })(req, res, next);
  }
}
