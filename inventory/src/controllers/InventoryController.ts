import { Controller, Get, Post, Put, Delete, Param, Body, Inject, Query } from '@nestjs/common';
import { IInventoryServiceToken, IInventoryService } from '../interfaces/IInventoryService';
import { Inventory } from '../models/entities/Inventory';
import { KafkaProducerService } from '../services/KafkaProducerService';
import { InventoryUpdateDto } from '../models/dtos/InventoryUpdateDto';
import { InventoryStockHistorialDto } from '../models/dtos/InventoryStockHistorialDto';
import { ProductDto } from '../models/dtos/ProductDto';
import { PriceHistorialDto } from '../models/dtos/PriceHistorialDto';

@Controller('api/inventory')
export class InventoryController {
  constructor(
    @Inject(IInventoryServiceToken) private readonly InventoryService: IInventoryService,
    @Inject() private readonly kafkaProducerService: KafkaProducerService) {}

  @Put()
  async update(@Body() Inventory: InventoryUpdateDto): Promise<Inventory | null> {
    //this.kafkaProducerService.produce({topic: 'inventory.update', messages: [{value: JSON.stringify(Inventory)}]})
    return await this.InventoryService.updateStock(Inventory);
  }

  @Get()
  async get(
    @Query('id') id?: number,
    @Query('sku') sku?: string
  ): Promise<number> {
    return await this.InventoryService.getStock({ id, sku });
  }

  @Get("/stockhistorial")
  async getStockHistorial(
    @Query('id') id?: number,
    @Query('sku') sku?: string
  ): Promise<InventoryStockHistorialDto[]> {
    return await this.InventoryService.getHistorialStock({ id, sku });
  }

  @Get("/products")
  async getAllProducts(
    @Query('currency') currency?: string,
    @Query('token') token?: string,
    @Query('role') role?: string
  ): Promise<ProductDto[]> {
    return await this.InventoryService.getProducts({ currency, token, role });
  }

  @Get("/pricehistorial")
  async getPriceHistorial(
    @Query('id') id?: number,
    @Query('sku') sku?: string
  ): Promise<PriceHistorialDto[]> {
    return await this.InventoryService.getHistorialPrice({ id, sku });
  }
}
