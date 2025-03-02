import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../services/UserService';
import { Repository } from 'typeorm';
import { User } from '../models/entities/User';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DatabaseModule } from '../modules/database.module';

describe('UserService (Integration Test)', () => {
  let service: UserService;
  let userRepository: Repository<User>;
  const testId = 9;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule], 
      providers: [UserService],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  afterAll(async () => {
    await userRepository.manager.connection.destroy(); 
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and return a user', async () => {
      const user: Partial<User> = { username: 'testuser', password: 'password', role: 'admin' };

      const createdUser = await service.create(user as User);

      expect(createdUser.id).toBeDefined();

      expect(createdUser.username).toBe(user.username);
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const foundUser = await service.findOne(testId);

      expect(foundUser).toBeDefined();
    });

    it('should return null if user not found', async () => {
      const result = await service.findOne(999);
      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update and return the updated user', async () => {

      await service.update(testId, { username: 'updateduser' } as User);
      
      const updatedUser = await service.findOne(testId);

      expect(updatedUser?.username).toBe('updateduser');
    });

    it('should return null if user does not exist', async () => {
      const result = await service.update(999, { username: 'newuser' } as User);
      expect(result).toBeNull();
    });
  });

  describe('remove', () => {
    it('should delete a user by id', async () => {

      await service.remove(testId);

      const deletedUser = await service.findOne(testId);

      expect(deletedUser).toBeNull();
    });

    it('should not throw error if user does not exist', async () => {
      await expect(service.remove(999)).resolves.toBeUndefined();
    });
  });
});
