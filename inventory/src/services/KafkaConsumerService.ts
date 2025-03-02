import { Injectable, OnApplicationShutdown } from "@nestjs/common";
import { Kafka, Consumer, ConsumerRunConfig, ConsumerSubscribeTopic } from "kafkajs";

@Injectable()
export class KafkaConsumerService implements OnApplicationShutdown{
   private readonly kafka = new Kafka ({brokers : ['localhost:9092'],})
   private readonly consumers: Consumer[] = [];

   async consume(topic: Omit<ConsumerSubscribeTopic, 'topic'> & { topics: string[] }, config: ConsumerRunConfig) {
    const consumer = this.kafka.consumer({ groupId: 'nestjs-kafka' });
    await consumer.connect();
    await consumer.subscribe(topic); // No necesitas cambiar esta línea, ya que KafkaJS admite `topics`
    await consumer.run(config);
    this.consumers.push(consumer);
  }
  

   async onApplicationShutdown() {
    for(const consumer of this.consumers){
        await consumer.disconnect();
    }
    }
}