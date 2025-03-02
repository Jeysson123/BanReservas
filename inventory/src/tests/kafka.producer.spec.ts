import { Test, TestingModule } from '@nestjs/testing';
import { KafkaProducerService } from '../services/KafkaProducerService';
import { Kafka } from 'kafkajs';

jest.mock('kafkajs', () => {
  return {
    Kafka: jest.fn().mockImplementation(() => ({
      producer: jest.fn().mockReturnValue({
        connect: jest.fn(),
        send: jest.fn(),
        disconnect: jest.fn(),
      }),
    })),
  };
});

describe('KafkaProducerService', () => {
  let service: KafkaProducerService;
  let producer: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KafkaProducerService],
    }).compile();

    service = module.get<KafkaProducerService>(KafkaProducerService);
    producer = service['producer']; // Access the private producer to mock it
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should connect to Kafka on module init', async () => {
    await service.onModuleInit();
    expect(producer.connect).toHaveBeenCalled();
  });

  it('should produce a record', async () => {
    const record = { topic: 'test-topic', messages: [{ value: 'test message' }] };
    await service.produce(record);
    expect(producer.send).toHaveBeenCalledWith(record);
  });

  it('should disconnect from Kafka on application shutdown', async () => {
    await service.onApplicationShutdown();
    expect(producer.disconnect).toHaveBeenCalled();
  });
});
