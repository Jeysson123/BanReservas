import { Module } from '@nestjs/common';
import { DatabaseModule } from './modules/database.module';
import { ProductModule } from './modules/product.module';
import { KafkaModule } from './modules/kafka.module'

@Module({
  imports: [DatabaseModule, ProductModule, KafkaModule],
})

export class AppModule {}
