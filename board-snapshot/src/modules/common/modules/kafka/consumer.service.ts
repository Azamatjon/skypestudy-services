import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConsumerConfig, ConsumerSubscribeTopics, KafkaMessage } from 'kafkajs';
import { IConsumer } from './consumer.interface';
import { KafkaConsumer } from './kafka.consumer';

interface KafkaConsumerOptions {
  topics: ConsumerSubscribeTopics;
  config: ConsumerConfig;
  onMessage: (message: KafkaMessage) => Promise<void>;
}

@Injectable()
export class ConsumerService implements OnApplicationShutdown {
  private readonly consumers: IConsumer[] = [];

  constructor(private readonly configService: ConfigService) {}

  async consume({ topics, config, onMessage }: KafkaConsumerOptions) {
    const consumer = new KafkaConsumer(
        topics,
        config,
        `${this.configService.get<string>('KAFKA_BROKER_HOST')}:${this.configService.get<string>('KAFKA_BROKER_PORT')}`
    );
    await consumer.connect();
    await consumer.consume(onMessage);
    this.consumers.push(consumer);
  }

  async onApplicationShutdown() {
    for (const consumer of this.consumers) {
      await consumer.disconnect();
    }
  }
}
