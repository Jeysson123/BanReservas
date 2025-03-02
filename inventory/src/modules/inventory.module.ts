import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryController } from '../controllers/InventoryController';
import { InventoryService } from '../services/InventoryService';
import { Inventory } from '../models/entities/Inventory';
import { IInventoryServiceToken } from '../interfaces/IInventoryService';
import { AuthMiddleware } from '../middlewares/AuthMiddleware';
import { KafkaModule } from './kafka.module';
import { AppRedisModule } from './redis.module';

@Module({
  imports: [TypeOrmModule.forFeature([Inventory]), KafkaModule, AppRedisModule],
  controllers: [InventoryController],
  providers: [
    InventoryService,
    {
      provide: IInventoryServiceToken,
      useClass: InventoryService,
    },
  ],
  exports: [InventoryService, IInventoryServiceToken],
})
export class InventoryModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('api/inventory');
  }
}
