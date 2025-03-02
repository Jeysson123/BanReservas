import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../models/entities/User';
import { IUserService } from '../interfaces/IUserService';

@Injectable()
export class UserService implements IUserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    try {
      return await this.userRepository.find();
    } catch (error) {
      throw new InternalServerErrorException('Error fetching users');
    }
  }

  async findOne(id: number): Promise<User | null> {
    try {
      const user = await this.userRepository.findOne({ where: { id } });
      if (user == null) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      return user;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error fetching user');
    }
  }

  async login(user: User): Promise<User | null> {
    try {
      const foundUser = await this.userRepository.findOne({
        where: { username: user.username, password: user.password },
      });
  
      if (foundUser == null) {
        throw new NotFoundException('Invalid username or password');
      }
  
      return foundUser;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error during login');
    }
  }
    
  async create(user: User): Promise<User> {
    try {
      const newUser = this.userRepository.create(user);
      return await this.userRepository.save(newUser);
    } catch (error) {
      throw new InternalServerErrorException('Error creating user');
    }
  }

  async update(id: number, user: User): Promise<User | null> {
    try {
      const existingUser = await this.findOne(id);
      if (existingUser == null) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      await this.userRepository.update(id, user);
      return await this.findOne(id);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error updating user');
    }
  }

  async remove(id: number): Promise<void> {
    try {
      const user = await this.findOne(id);
      if (user == null) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      await this.userRepository.delete(id);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error deleting user');
    }
  }
}
