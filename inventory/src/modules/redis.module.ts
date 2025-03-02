import { Module } from '@nestjs/common';
import { RedisModule } from '@nestjs-modules/ioredis';
import { RedisService } from '../services/RedisService';  // adjust the path as needed

@Module({
  imports: [
    RedisModule.forRoot({
      url: 'redis://localhost:6379',
      type: 'single'
    }),
  ],
  providers: [RedisService],
  exports: [RedisModule, RedisService],
})
export class AppRedisModule {}
