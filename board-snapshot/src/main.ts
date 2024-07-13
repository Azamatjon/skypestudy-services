import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {ConfigService} from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = await app.get(ConfigService);
  console.log('node env: ', config.get<string>('NODE_ENV'));

  const port = config.get<number>('PORT');
  await app.listen(port);

  console.log(`The project has been started on port: ${port}`);
}

bootstrap();
