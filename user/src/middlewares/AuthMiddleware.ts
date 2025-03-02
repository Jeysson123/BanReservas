import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/AuthService';

@Injectable()

export class AuthMiddleware implements NestMiddleware {

  constructor(private readonly authService: AuthService) {}

  async use(req: Request, res: Response, next: NextFunction) {

    if (req.originalUrl.includes('users')) {

      const authHeader = req.headers['authorization'];

      if (!authHeader) {

        throw new UnauthorizedException('No token provided');
      }

      const token = authHeader.split(' ')[1];

      if (!token) {

        throw new UnauthorizedException('Malformed token');

      }

      try {

        const isValid = await this.authService.validateToken(token);

        if (!isValid) {
          throw new UnauthorizedException('Invalid token');
        }

        next();

      } catch (error) {
        throw new UnauthorizedException('Invalid or expired token');
      }
    } else {
      next();
    }
  }
}
