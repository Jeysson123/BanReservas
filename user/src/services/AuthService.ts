import { Injectable, UnauthorizedException } from '@nestjs/common';
import { sign } from 'jsonwebtoken';
import { LoginDto } from '../models/dtos/LoginDto';
import * as fs from 'fs';
import * as path from 'path';
import { IAuthService } from '../interfaces/IAuthService';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService implements IAuthService {

  async generateToken(dto: LoginDto): Promise<string> {

    try {

      const configPath = path.resolve(__dirname, '..', '..', 'config.json');

      const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

      const { jwtSecret, jwtUser, jwtPassword } = config;

      if (dto.username !== jwtUser || dto.password !== jwtPassword) {

        throw new UnauthorizedException('Invalid credentials');

      }

      return sign({ username: dto.username }, jwtSecret, { expiresIn: '1h' });

    } catch (error) {

      throw new UnauthorizedException('Error generating token');
    }
  }

  async validateToken(token: string): Promise<boolean> {

    try {

      const configPath = path.resolve(__dirname, '..', '..', 'config.json');

      const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

      const { jwtSecret } = config;

      jwt.verify(token, jwtSecret); 

      return true;

    } catch (error) {

      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
