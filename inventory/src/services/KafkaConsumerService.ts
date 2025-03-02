import { Injectable, OnApplicationShutdown } from "@nestjs/common";
import { Kafka, Consumer, ConsumerRunConfig, ConsumerSubscribeTopic } from "kafkajs";
import * as fs from "fs";

@Injectable()
export class KafkaConsumerService implements OnApplicationShutdown{
   private readonly config = JSON.parse(fs.readFileSync('config.json', 'utf8'));
   private readonly env = process.env.NODE_ENV || 'local';
   private readonly kafkaConfig = this.config.kafka[this.env];
   private readonly kafka = new Kafka({brokers: [`${this.kafkaConfig.host}:${this.kafkaConfig.port}`],});
   private readonly consumers: Consumer[] = [];

   async consume(topic: Omit<ConsumerSubscribeTopic, 'topic'> & { topics: string[] }, config: ConsumerRunConfig) {
    const consumer = this.kafka.consumer({ groupId: 'nestjs-kafka' });
    await consumer.connect();
    await consumer.subscribe(topic);
    await consumer.run(config);
    this.consumers.push(consumer);
  }
  

   async onApplicationShutdown() {
    for(const consumer of this.consumers){
        await consumer.disconnect();
    }
    }
}