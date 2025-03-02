import { Module } from "@nestjs/common";
import { KafkaProducerService } from "../services/KafkaProducerService";
import { KafkaConsumerService } from "../services/KafkaConsumerService";

@Module({
    providers: [KafkaProducerService, KafkaConsumerService],
    exports: [KafkaProducerService, KafkaConsumerService]
})
export class KafkaModule {}