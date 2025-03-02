import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inventory } from '../models/entities/Inventory';
import * as fs from 'fs';

const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));
const env = process.env.NODE_ENV || 'local';
const dbConfig = config.database[env];

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: dbConfig.host,
      port: dbConfig.port,
      username: dbConfig.username,
      password: dbConfig.password,
      database: dbConfig.database,
      entities: [Inventory],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Inventory]),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
