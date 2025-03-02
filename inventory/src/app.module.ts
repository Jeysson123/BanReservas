import { Module } from '@nestjs/common';
import { DatabaseModule } from './modules/database.module';
import { InventoryModule } from './modules/inventory.module';
import { KafkaModule } from './modules/kafka.module'
import { AppRedisModule } from './modules/redis.module'

@Module({
  imports: [DatabaseModule, InventoryModule, KafkaModule, AppRedisModule],
})

export class AppModule {}
