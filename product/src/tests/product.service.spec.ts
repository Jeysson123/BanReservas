import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from '../services/ProductService';
import { Repository } from 'typeorm';
import { Product } from '../models/entities/Product';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DatabaseModule } from '../modules/database.module';

describe('ProductService (Integration Test)', () => {
  let service: ProductService;
  let ProductRepository: Repository<Product>;
  const testId = 9;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule], 
      providers: [ProductService],
    }).compile();

    service = module.get<ProductService>(ProductService);
    ProductRepository = module.get<Repository<Product>>(getRepositoryToken(Product));
  });

  afterAll(async () => {
    await ProductRepository.manager.connection.destroy(); 
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and return a Product', async () => {

      const Product: Partial<Product> = { name: 'testProduct', description: 'password', category: 'admin', price : '1', sku: '123' };

      const createdProduct = await service.create(Product as Product);

      expect(createdProduct.id).toBeDefined();

      expect(createdProduct.name).toBe(Product.name);
    });
  });

  describe('findOne', () => {
    it('should return a Product by id', async () => {
      const foundProduct = await service.findOne(testId);

      expect(foundProduct).toBeDefined();
    });

    it('should return null if Product not found', async () => {
      const result = await service.findOne(999);
      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update and return the updated Product', async () => {

      await service.update(testId, { name: 'updatedProduct' } as Product);
      
      const updatedProduct = await service.findOne(testId);

      expect(updatedProduct?.name).toBe('updatedProduct');
    });

    it('should return null if Product does not exist', async () => {
      const result = await service.update(999, { name: 'newProduct' } as Product);
      expect(result).toBeNull();
    });
  });

  describe('remove', () => {
    it('should delete a Product by id', async () => {

      await service.remove(testId);

      const deletedProduct = await service.findOne(testId);

      expect(deletedProduct).toBeNull();
    });

    it('should not throw error if Product does not exist', async () => {
      await expect(service.remove(999)).resolves.toBeUndefined();
    });
  });
});
