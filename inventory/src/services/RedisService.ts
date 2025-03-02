import { Injectable } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Redis } from 'ioredis';
import { InventoryStockHistorialDto } from '../models/dtos/InventoryStockHistorialDto';
import { PriceHistorialDto } from '../models/dtos/PriceHistorialDto';

@Injectable()
export class RedisService {

  constructor(@InjectRedis() private readonly redisClient: Redis) {}

  async addToStockHistory(product:InventoryStockHistorialDto): Promise<void> {

    const entry = JSON.stringify(product);

    await this.redisClient.lpush(`historystock:${product.sku}`, entry);

    await this.redisClient.ltrim(`historystock:${product.sku}`, 0, 9);

  }

  async addToPriceHistory(product:PriceHistorialDto): Promise<void> {

    const entry = JSON.stringify(product);

    await this.redisClient.lpush(`historyprice:${product.sku}`, entry);

    await this.redisClient.ltrim(`historyprice:${product.sku}`, 0, 9);

  }

  async getStockHistory(filters: { id?: number; sku?: string }): Promise<InventoryStockHistorialDto[]> {

    let key: string;
  
    if (filters.sku) {
      key = `historystock:${filters.sku}`;
    } else if (filters.id) {
      key = `historystock:id:${filters.id}`;
    } else {
      throw new Error('Either id or sku must be provided');
    }
  
    const history = await this.redisClient.lrange(key, 0, -1);

    return history.map(item => JSON.parse(item));

  }  

  async getPriceHistory(filters: { id?: number; sku?: string }): Promise<PriceHistorialDto[]> {

    let key: string;
  
    if (filters.sku) {
      key = `historyprice:${filters.sku}`;
    } else if (filters.id) {
      key = `historyprice:id:${filters.id}`;
    } else {
      throw new Error('Either id or sku must be provided');
    }
  
    const history = await this.redisClient.lrange(key, 0, -1);

    return history.map(item => JSON.parse(item));

  }  
}
