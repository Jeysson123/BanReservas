import { Controller, Get, Post, Put, Delete, Param, Body, Inject } from '@nestjs/common';
import { IUserServiceToken, IUserService } from '../interfaces/IUserService';
import { User } from '../models/entities/User';

@Controller('api/users')
export class UserController {
  constructor(
    @Inject(IUserServiceToken) private readonly userService: IUserService,
  ) {}

  @Get()
  async findAll(): Promise<User[]> {
    return await this.userService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<User | null> {
    return await this.userService.findOne(id);
  }

  @Post("/login")
  async login(@Body() user: User): Promise<User | null> {
    return await this.userService.login(user);
  }

  @Post()
  async create(@Body() user: User): Promise<User> {
    return await this.userService.create(user);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() user: User): Promise<User | null> {
    return await this.userService.update(id, user);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return await this.userService.remove(id);
  }
}
