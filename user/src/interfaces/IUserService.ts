import { User } from '../models/entities/User';
export const IUserServiceToken = 'IUserService';

export interface IUserService {
  findAll(): Promise<User[]>;
  findOne(id: number): Promise<User | null>;
  login(user: User): Promise<User | null>;
  create(user: User): Promise<User>;
  update(id: number, user: User): Promise<User | null>;
  remove(id: number): Promise<void>;
}
