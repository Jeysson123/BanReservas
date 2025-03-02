import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../models/entities/Product';
import { IProductService } from '../interfaces/IProductService';

@Injectable()
export class ProductService implements IProductService {
  constructor(
    @InjectRepository(Product)
    private readonly ProductRepository: Repository<Product>,
  ) {}

  async findAll(filters?: { id?: number; category?: string }): Promise<Product[]> {
    try {
      const queryBuilder = this.ProductRepository.createQueryBuilder('product');
  
      if (filters?.id) {
        queryBuilder.andWhere('product.id = :id', { id: filters.id });
      }
      if (filters?.category) {
        queryBuilder.andWhere('product.category = :category', { category: filters.category });
      }
  
      return await queryBuilder.getMany();
    } catch (error) {
      throw new InternalServerErrorException('Error fetching Products');
    }
  }
  

  async findOne(id: number): Promise<Product | null> {
    try {
      const Product = await this.ProductRepository.findOne({ where: { id } });
      if (Product == null) {
        throw new NotFoundException(`Product with ID ${id} not found`);
      }
      return Product;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error fetching Product');
    }
  }

  async create(Product: Product): Promise<Product> {
    try {
      const newProduct = this.ProductRepository.create(Product);
      return await this.ProductRepository.save(newProduct);
    } catch (error) {
      throw new InternalServerErrorException('Error creating Product');
    }
  }

  async update(id: number, Product: Product): Promise<Product | null> {
    try {
      const existingProduct = await this.findOne(id);
      if (existingProduct == null) {
        throw new NotFoundException(`Product with ID ${id} not found`);
      }
      await this.ProductRepository.update(id, Product);
      return await this.findOne(id);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error updating Product');
    }
  }

  async remove(id: number): Promise<void> {
    try {
      const Product = await this.findOne(id);
      if (Product == null) {
        throw new NotFoundException(`Product with ID ${id} not found`);
      }
      await this.ProductRepository.delete(id);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error deleting Product');
    }
  }
}
