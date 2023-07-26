import { Module } from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import {KafkaModule} from "./modules/common/modules/kafka/kafka.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`${process.cwd()}/.env.${process.env.NODE_ENV}`, `${process.cwd()}/.env`]
    }),
    KafkaModule
  ]
})
export class AppModule {}
