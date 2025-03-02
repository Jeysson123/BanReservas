import { Product } from '../models/entities/Product';
export const IProductServiceToken = 'IProductService';

export interface IProductService {
  findAll(filters?: { id?: number; category?: string }): Promise<Product[]>;
  findOne(id: number): Promise<Product | null>;
  create(Product: Product): Promise<Product>;
  update(id: number, Product: Product): Promise<Product | null>;
  remove(id: number): Promise<void>;
}
