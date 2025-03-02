import { Controller, Get, Post, Put, Delete, Param, Body, Inject, Query } from '@nestjs/common';
import { IProductServiceToken, IProductService } from '../interfaces/IProductService';
import { Product } from '../models/entities/Product';
import { KafkaProducerService } from '../services/KafkaProducerService';
import { PriceHistorialDto } from '../models/dtos/PriceHistorialDto';

@Controller('api/products')
export class ProductController {
  constructor(
    @Inject(IProductServiceToken) private readonly productService: IProductService,
    @Inject() private readonly kafkaProducerService: KafkaProducerService) {}

  @Get()
  async findAll(
    @Query('id') id?: number,
    @Query('category') category?: string
  ): Promise<Product[]> {
    return await this.productService.findAll({ id, category });
  }
  
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Product | null> {
    return await this.productService.findOne(id);
  }

  @Post()
  async create(@Body() product: Product): Promise<Product> {
    this.kafkaProducerService.produce({topic: 'inventory.create', messages: [{value: JSON.stringify(product)}]});
    return await this.productService.create(product);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() product: Product): Promise<Product | null> {
    //Produce event, only if is changing price, for store in price history (redis) and save resources
    if (product.hasOwnProperty('price')) {
      const productEvent = await this.findOne(id);
      if(productEvent != null){
        const originalPrice = productEvent.price;
        productEvent.price = product.price;
        this.kafkaProducerService.produce({topic: 'inventory.update', 
          messages: [{value: JSON.stringify(new PriceHistorialDto(
              productEvent.sku, productEvent.name != product.name && product.name ? product.name : productEvent.name,
              originalPrice, productEvent.price, new Date()
          ))}]});
      }
    }
    return await this.productService.update(id, product);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    this.kafkaProducerService.produce({topic: 'inventory.delete', messages: [{value: JSON.stringify(await this.findOne(id))}]});
    await this.productService.remove(id);
  }
}
