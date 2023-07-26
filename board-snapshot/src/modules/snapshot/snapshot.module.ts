import { Module, OnModuleInit } from '@nestjs/common';
import {SnapshotService} from "./snapshot.service";
import {ConsumerService} from "../common/modules/kafka/consumer.service";

@Module({
  providers: [SnapshotService, ConsumerService],
})
export class SnapshotModule implements OnModuleInit {
  constructor(private readonly consumerService: ConsumerService, private readonly snapshotService: SnapshotService) {}

  async onModuleInit() {
    await this.consumerService.consume({
      topics: { topics: ['lesson-board.snapshot.create'] },
      config: { groupId: 'snapshot-creator-consumer' },
      onMessage: async (message) => {
        await this.snapshotService.takeSnapshot(parseInt(message.value.toString()))
      }
    });
  }
}
