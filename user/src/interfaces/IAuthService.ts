import { LoginDto } from "../models/dtos/LoginDto";
export const IAuthServiceToken = 'IAuthService';

export interface IAuthService {
  generateToken(dto: LoginDto): Promise<string>;
}
