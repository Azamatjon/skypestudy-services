import { Logger } from '@nestjs/common';
import { Consumer, ConsumerConfig, ConsumerSubscribeTopics, Kafka, KafkaMessage } from 'kafkajs';
import { IConsumer } from './consumer.interface';

export class KafkaConsumer implements IConsumer {
  private readonly kafka: Kafka;
  private readonly consumer: Consumer;
  private readonly logger: Logger;

  constructor(private readonly topics: ConsumerSubscribeTopics, config: ConsumerConfig, broker: string) {
    this.kafka = new Kafka({ brokers: [broker] });
    this.consumer = this.kafka.consumer(config);
    this.logger = new Logger(`${topics.topics}-${config.groupId}`);
  }

  async consume(onMessage: (message: KafkaMessage) => Promise<void>) {
    await this.consumer.subscribe(this.topics);
    await this.consumer.run({
      eachMessage: async ({ message, partition }) => {
        this.logger.debug(`Processing message partition: ${partition}`);
        try {
          await onMessage(message)
        } catch (err) {
          this.logger.error('Error consuming message. Adding to dead letter queue...', err);
          await this.addMessageToDlq(message);
        }
      }
    });
  }

  private async addMessageToDlq(message: KafkaMessage) {
    // await this.databaseService
    //   .getDbHandle()
    //   .collection('dlq')
    //   .insertOne({ value: message.value, topic: this.topic.topic });
  }

  async connect() {
    try {
      await this.consumer.connect();
    } catch (err) {
      this.logger.error('Failed to connect to Kafka.', err);
      setTimeout(async () => {
        await this.connect();
      }, 5000);
    }
  }

  async disconnect() {
    await this.consumer.disconnect();
  }
}
