import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductController } from '../controllers/ProductController';
import { ProductService } from '../services/ProductService';
import { Product } from '../models/entities/Product';
import { IProductServiceToken } from '../interfaces/IProductService';
import { AuthMiddleware } from '../middlewares/AuthMiddleware';
import { KafkaModule } from './kafka.module';

@Module({
  imports: [TypeOrmModule.forFeature([Product]), KafkaModule],
  controllers: [ProductController],
  providers: [
    ProductService,
    {
      provide: IProductServiceToken,
      useClass: ProductService,
    },
  ],
  exports: [ProductService, IProductServiceToken],
})
export class ProductModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('api/products');
  }
}
