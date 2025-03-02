import { Module } from '@nestjs/common';
import { RedisModule } from '@nestjs-modules/ioredis';
import { RedisService } from '../services/RedisService';
import * as fs from 'fs';

const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));
const env = process.env.NODE_ENV || 'local';
const redisConfig = config.redis[env];

@Module({
  imports: [
    RedisModule.forRoot({
      url: `redis://${redisConfig.host}:${redisConfig.port}`,
      type: 'single'
    }),
  ],
  providers: [RedisService],
  exports: [RedisModule, RedisService],
})
export class AppRedisModule {}
