import { Test, TestingModule } from '@nestjs/testing';
import { InventoryService } from '../services/InventoryService';
import { Repository } from 'typeorm';
import { Inventory } from '../models/entities/Inventory';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DatabaseModule } from '../modules/database.module';

describe('InventoryService (Integration Test)', () => {
  let service: InventoryService;
  let InventoryRepository: Repository<Inventory>;
  const testId = 9;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule], 
      providers: [InventoryService],
    }).compile();

    service = module.get<InventoryService>(InventoryService);
    InventoryRepository = module.get<Repository<Inventory>>(getRepositoryToken(Inventory));
  });

  afterAll(async () => {
    await InventoryRepository.manager.connection.destroy(); 
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and return a Inventory', async () => {

      const Inventory: Partial<Inventory> = { sku : '123', quantity: '1' };

      const createdInventory = await service.create(Inventory as Inventory);

      expect(createdInventory.id).toBeDefined();

      expect(createdInventory.name).toBe(Inventory.name);
    });
  });

  describe('findOne', () => {
    it('should return a Inventory by id', async () => {
      const foundInventory = await service.findOne(testId);

      expect(foundInventory).toBeDefined();
    });

    it('should return null if Inventory not found', async () => {
      const result = await service.findOne(999);
      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update and return the updated Inventory', async () => {

      await service.update(testId, { sku: '123' } as Inventory);
      
      const updatedInventory = await service.findOne(testId);

      expect(updatedInventory?.sku).toBe('123');
    });

    it('should return null if Inventory does not exist', async () => {
      const result = await service.update(999, { sku: '123' } as Inventory);
      expect(result).toBeNull();
    });
  });

  describe('remove', () => {
    it('should delete a Inventory by id', async () => {

      await service.remove(testId);

      const deletedInventory = await service.findOne(testId);

      expect(deletedInventory).toBeNull();
    });

    it('should not throw error if Inventory does not exist', async () => {
      await expect(service.remove(999)).resolves.toBeUndefined();
    });
  });
});
