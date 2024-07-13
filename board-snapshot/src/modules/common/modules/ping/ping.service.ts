import { Injectable } from '@nestjs/common';
import { measureRunTime } from './performance.util';

@Injectable()
export class PingService {
  constructor() {}

  async ping() {
    return {
      consumerState: await measureRunTime(async () => {}),
    };
  }
}
