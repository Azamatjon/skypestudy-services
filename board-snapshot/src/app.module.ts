import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { KafkaModule } from './modules/common/modules/kafka/kafka.module';
import { SnapshotModule } from './modules/snapshot/snapshot.module';
import { PingModule } from './modules/common/modules/ping/ping.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        `${process.cwd()}/.env.${process.env.NODE_ENV}`,
        `${process.cwd()}/.env`,
      ],
    }),
    KafkaModule,
    SnapshotModule,
    PingModule,
  ],
})
export class AppModule {}
