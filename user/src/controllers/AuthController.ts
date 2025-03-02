import { Controller, Post, Body, Inject } from '@nestjs/common';
import { IAuthServiceToken, IAuthService } from '../interfaces/IAuthService';
import { LoginDto } from '../models/dtos/LoginDto';

@Controller('api/auth')
export class AuthController {
  constructor(
    @Inject(IAuthServiceToken) private readonly authService: IAuthService,  
  ) {}

  @Post()
  async getToken(@Body() loginDto: LoginDto): Promise<{ token: string }> {
    const token = await this.authService.generateToken(loginDto);
    return { token };
  }
}
