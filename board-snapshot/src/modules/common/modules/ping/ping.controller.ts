import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { PingResponse } from './dto/ping.response';
import { PingService } from './ping.service';

@Controller('ping')
export class PingController {
  constructor(private readonly pingService: PingService) {}

  @Get()
  public async ping(@Res() response): Promise<PingResponse> {
    try {
      return response.status(HttpStatus.OK).send(await this.pingService.ping());
    } catch (e) {
      return response.status(HttpStatus.SERVICE_UNAVAILABLE).send({
        consumerState: -1,
      });
    }
  }
}
