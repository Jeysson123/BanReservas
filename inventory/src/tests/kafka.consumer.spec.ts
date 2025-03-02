import { Test, TestingModule } from '@nestjs/testing';
import { KafkaConsumerService } from '../services/KafkaConsumerService';
import { Kafka } from 'kafkajs';

jest.mock('kafkajs', () => {
  return {
    Kafka: jest.fn().mockImplementation(() => ({
      consumer: jest.fn().mockReturnValue({
        connect: jest.fn(),
        subscribe: jest.fn(),
        run: jest.fn(),
        disconnect: jest.fn(),
      }),
    })),
  };
});

describe('KafkaConsumerService', () => {
  let service: KafkaConsumerService;
  let consumer: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KafkaConsumerService],
    }).compile();

    service = module.get<KafkaConsumerService>(KafkaConsumerService);
    consumer = service['kafka'].consumer; // Access the private kafka consumer to mock it
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should connect and subscribe to Kafka topic on consume', async () => {
    const topic = { topic: 'test-topic' };
    const config = { eachMessage: jest.fn() };
    await service.consume(topic, config);
    expect(consumer.connect).toHaveBeenCalled();
    expect(consumer.subscribe).toHaveBeenCalledWith(topic);
    expect(consumer.run).toHaveBeenCalledWith(config);
  });

  it('should disconnect from Kafka on application shutdown', async () => {
    await service.onApplicationShutdown();
    expect(consumer.disconnect).toHaveBeenCalled();
  });
});
