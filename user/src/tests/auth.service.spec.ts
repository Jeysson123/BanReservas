import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../services/AuthService';
import { UnauthorizedException } from '@nestjs/common';
import { LoginDto } from '../models/dtos/LoginDto';
import * as fs from 'fs';
import * as path from 'path';

jest.mock('fs');
jest.mock('path');

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateToken', () => {
    it('should return a token if credentials are valid', async () => {
      const dto: LoginDto = { username: 'test', password: 'password' };

      const configMock = {
        jwtSecret: 'secret',
        jwtUsername: 'test',
        jwtPassword: 'password',
      };

      (fs.readFileSync as jest.Mock).mockReturnValueOnce(JSON.stringify(configMock));
      (path.resolve as jest.Mock).mockReturnValueOnce('config.json');

      const generatedToken = await service.generateToken(dto);

      expect(generatedToken).not.toBeNull();
    });

    it('should throw UnauthorizedException if credentials are invalid', async () => {
      const dto: LoginDto = { username: 'wrongUser', password: 'wrongPass' };

      const configMock = {
        jwtSecret: 'secret',
        jwtUsername: 'test',
        jwtPassword: 'password',
      };

      (fs.readFileSync as jest.Mock).mockReturnValueOnce(JSON.stringify(configMock));
      (path.resolve as jest.Mock).mockReturnValueOnce('config.json');

      await expect(service.generateToken(dto)).rejects.toThrow(UnauthorizedException);
    });
  });
});
