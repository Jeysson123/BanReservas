import { InventoryStockHistorialDto } from '../models/dtos/InventoryStockHistorialDto';
import { InventoryUpdateDto } from '../models/dtos/InventoryUpdateDto';
import { PriceHistorialDto } from '../models/dtos/PriceHistorialDto';
import { ProductDto } from '../models/dtos/ProductDto';
import { Inventory } from '../models/entities/Inventory';
export const IInventoryServiceToken = 'IInventoryService';

export interface IInventoryService {
  updateStock(inventory: InventoryUpdateDto): Promise<Inventory | null>;
  getStock(filters?: { id?: number; sku?: string }): Promise<number>;
  getHistorialStock(filters?: { id?: number; sku?: string }): Promise<InventoryStockHistorialDto[]>;
  getProducts(filters?: { currency?: string; token?: string; role?: string; }): Promise<ProductDto[]>;
  getHistorialPrice(filters?: { id?: number; sku?: string }): Promise<PriceHistorialDto[]>;
  create(inventory: Inventory): Promise<Inventory | null>;
  remove(sku: string): Promise<void>;
  findOne(id: number): Promise<Inventory | null>;
}
