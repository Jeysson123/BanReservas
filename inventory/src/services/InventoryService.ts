import { Injectable, InternalServerErrorException, NotFoundException, OnModuleInit } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Inventory } from '../models/entities/Inventory';
import { IInventoryService } from '../interfaces/IInventoryService';
import { InventoryUpdateDto } from '../models/dtos/InventoryUpdateDto';
import { KafkaConsumerService } from './KafkaConsumerService';
import { ConsumerSubscribeTopic, Message } from 'kafkajs';
import { RedisService } from './RedisService';
import { InventoryStockHistorialDto } from '../models/dtos/InventoryStockHistorialDto';
import { ProductDto } from '../models/dtos/ProductDto';
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import { PriceHistorialDto } from '../models/dtos/PriceHistorialDto';

@Injectable()
export class InventoryService implements IInventoryService, OnModuleInit {
  constructor(
    @InjectRepository(Inventory)
    private readonly InventoryRepository: Repository<Inventory>,
    private readonly kafkaConsumerService: KafkaConsumerService,
    private readonly redisService: RedisService,
  ) {} 
  
  async onModuleInit() {

    const consumerConfig = {
      eachMessage: async ({ topic, partition, message }: { topic: string, partition: number, message: Message }) => {
        try {
          let messageString;
          let parsedMessage;

          if (message.value) {

            messageString = message.value.toString('utf-8');
      
            parsedMessage = JSON.parse(messageString);
      
            console.log(`Message received from topic ${topic} on partition ${partition}:`, parsedMessage);
      
          } else {
            console.error('Message has no value.');
          }
          
          switch(topic){
            case "inventory.create":
              this.create(new Inventory (parsedMessage.sku, 100));
              break;
            case "inventory.update":
              await this.redisService.addToPriceHistory(parsedMessage);
              break;  
            case "inventory.delete":
              await this.remove(parsedMessage.sku);
              break;  
          }
        } catch (error) {
          console.error('Error processing message:', error);
        }
      },
    };

    await this.kafkaConsumerService.consume(
      { topics: ['inventory.create', 'inventory.update', 'inventory.delete'], fromBeginning: true },
      consumerConfig,
    );
    
  }

  async updateStock(inventory: InventoryUpdateDto): Promise<Inventory | null> {
    try {
      const inventoryItem = await this.InventoryRepository.findOne({ where: { sku: inventory.sku } });

      if (!inventoryItem) {
        throw new NotFoundException(`Inventory with SKU ${inventory.sku} not found`);
      }

      if (inventory.quantity === undefined || inventory.quantity === null) {
        throw new InternalServerErrorException('Quantity must be provided');
      }
      
      const originalQuantity = inventoryItem.quantity;

      inventoryItem.quantity = inventory.incrementing
        ? Number(inventoryItem.quantity) + inventory.quantity
        : Number(inventoryItem.quantity) - inventory.quantity;

      if(inventoryItem.quantity < 0) inventoryItem.quantity = 0;

      //update history in redis : quantity -> new quantity
      await this.redisService.addToStockHistory(new InventoryStockHistorialDto(inventory.sku, originalQuantity, inventoryItem.quantity, new Date()));

      return await this.InventoryRepository.save(inventoryItem);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error updating Inventory');
    }
  }

  async getStock(filters?: { id?: number; sku?: string }): Promise<number> {
    try {
      const queryBuilder = this.InventoryRepository.createQueryBuilder('inventory');
  
      if (filters?.id) {
        queryBuilder.andWhere('inventory.id = :id', { id: filters.id });
      }
      if (filters?.sku) {
        queryBuilder.andWhere('inventory.sku = :sku', { sku: filters.sku });
      }
  
      const inventory = await queryBuilder.getOne();
      
      return inventory?.quantity ?? 0;
    } catch (error) {
      throw new InternalServerErrorException('Error fetching stock');
    }
  }
  
  async getHistorialStock(filters?: { id?: number; sku?: string; }): Promise<InventoryStockHistorialDto[]> {
    try {

      if (!filters || (!filters.id && !filters.sku)) {
        return [];
      }
      
      return await this.redisService.getStockHistory(filters);
    } catch (error) {
      throw new InternalServerErrorException('Error fetching stock');
    }
  }

  async getProducts(filters?: { currency?: string; token?: string; role?: string }): Promise<ProductDto[]> {
    try {
      const configPath = path.resolve(__dirname, '..', '..', 'config.json');
      const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  
      const { productUrl, exchangeUrl, exchangeKey } = config;
  
      const headers: any = {};
      if (filters?.token) {
        headers.Authorization = `Bearer ${filters.token}`;
      }
      if (filters?.role) {
        headers.Role = filters.role;
      }
  
      const currency = filters?.currency || 'USD';
      const exchangeApiUrl = exchangeUrl.replace('${apiKey}', exchangeKey).replace('{currency}', currency);
  
      const [productsResponse, exchangeResponse] = await Promise.all([
        axios.get(productUrl, { headers }),
        axios.get(exchangeApiUrl)
      ]);
  
      const products = productsResponse.data;
      const conversionRates = exchangeResponse.data.conversion_rates;
  
      if (!conversionRates || !conversionRates[currency]) {
        throw new InternalServerErrorException(`Conversion rate for ${currency} not found`);
      }
  
      return products.map((product: any) => {
        const priceAsNumber = parseFloat(product.price);
        let convertedPrice = priceAsNumber;
  
        if (currency === 'USD') {
          //API not return DOP Equivalent, so we need to apply this manually
          convertedPrice = priceAsNumber / 62.50;
        } else {
          convertedPrice = priceAsNumber * conversionRates[currency];
        }
        return new ProductDto(product.sku, product.name, convertedPrice);
      });
  
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Error fetching stock or converting prices');
    }
  }

  async getHistorialPrice(filters?: { id?: number; sku?: string; }): Promise<PriceHistorialDto[]> {
    try {

      if (!filters || (!filters.id && !filters.sku)) {
        return [];
      }
      
      return await this.redisService.getPriceHistory(filters);
    } catch (error) {
      throw new InternalServerErrorException('Error fetching price historial');
    }
  }

  async create(inventory: Inventory): Promise<Inventory | null> {
    try {
      return await this.InventoryRepository.save(inventory);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error deleting Inventory');
    }
  }

  async remove(sku: string): Promise<void> {
    try {
      const inventory = await this.InventoryRepository.findOne({ where: { sku } });
      await this.InventoryRepository.delete(inventory?.id);
    } catch (error) {
      console.log(error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error deleting Product');
    }
  }
}
