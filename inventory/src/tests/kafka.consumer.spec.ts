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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KafkaConsumerService],
    }).compile();

    service = module.get<KafkaConsumerService>(KafkaConsumerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should connect and subscribe to Kafka topic on consume', async () => {
    const topicObj = { topics: ['test-topic'] };
    const config = { eachMessage: jest.fn() };

    await service.consume(topicObj, config);

    const consumerFactory = service['kafka'].consumer as jest.Mock;
    const consumerInstance = consumerFactory.mock.results[0].value;

    expect(consumerInstance.connect).toHaveBeenCalled();
    expect(consumerInstance.subscribe).toHaveBeenCalledWith(topicObj);
    expect(consumerInstance.run).toHaveBeenCalledWith(config);
  });

  it('should disconnect from Kafka on application shutdown', async () => {
    await service.onApplicationShutdown();

    const consumerFactory = service['kafka'].consumer as jest.Mock;
    const consumerInstance = consumerFactory.mock.results[0].value;
    expect(consumerInstance.disconnect).toHaveBeenCalled();
  });
});
