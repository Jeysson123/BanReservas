import { Injectable, OnApplicationShutdown, OnModuleInit } from "@nestjs/common";
import { Kafka, Producer, ProducerRecord } from "kafkajs";
import * as fs from "fs";

@Injectable()
export class KafkaProducerService implements OnModuleInit, OnApplicationShutdown {
   private readonly config = JSON.parse(fs.readFileSync('config.json', 'utf8'));
   private readonly env = process.env.NODE_ENV || 'local';
   private readonly kafkaConfig = this.config.kafka[this.env];
   private readonly kafka = new Kafka({brokers: [`${this.kafkaConfig.host}:${this.kafkaConfig.port}`],});
   private readonly producer: Producer = this.kafka.producer();

   async onModuleInit() {
        await this.producer.connect();
    }

   async produce(record: ProducerRecord){
        await this.producer.send(record);
    }

   async onApplicationShutdown() {
        await this.producer.disconnect();
    }
    
}