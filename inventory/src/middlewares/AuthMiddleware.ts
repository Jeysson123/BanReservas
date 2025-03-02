import { Injectable, NestMiddleware, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    if (req.originalUrl.includes('inventory')) {
      const authHeader = req.headers['authorization'];
      const authRole = req.headers['role'];

      if (!authHeader) {
        throw new UnauthorizedException('No token provided');
      }

      if (!authRole) {
        throw new UnauthorizedException('No role provided');
      }

      const token = authHeader.split(' ')[1];

      if (!token) {
        throw new UnauthorizedException('Malformed token');
      }

      // Restrict users with role 'user' from modifying data
      if (authRole === 'user' && ['POST', 'PUT', 'DELETE'].includes(req.method)) {
        throw new ForbiddenException('You are not authorized to perform this action');
      }

      next();
    } else {
      next();
    }
  }
}
