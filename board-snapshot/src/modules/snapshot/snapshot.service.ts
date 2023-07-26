import {Injectable, Logger} from '@nestjs/common';
import {ProducerService} from "../common/modules/kafka/producer.service";
import * as puppeteer from "puppeteer";
import {ConfigService} from "@nestjs/config";

@Injectable()
export class SnapshotService {
  private readonly logger: Logger

  constructor(
      private readonly producerService: ProducerService,
      private readonly configService: ConfigService,
  ) {
    this.logger = new Logger('SnapshotService');
  }

  async takeSnapshot(lessonBoardId: number) {
    this.logger.log('takeSnapshot', lessonBoardId)

    const browser = await puppeteer.launch({
      headless: 'new',
      executablePath: process.env.EXECUTABLE_PATH,
      args: [
        "--no-sandbox",
        "--disable-gpu",
      ]
    });

    const page = await browser.newPage();
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));

    // Navigate the page to a URL
    await page.goto(`${this.configService.get<string>('SNAPSHOT_HOST')}/lesson-board/${lessonBoardId}/preview`, { waitUntil: 'networkidle0' });

    // Set screen size
    const width = this.configService.get<number>('SNAPSHOT_WIDTH')
    const height = this.configService.get<number>('SNAPSHOT_HEIGHT')
    await page.setViewport({ width, height });

    // To reflect CSS used for screens instead of print
    await page.emulateMediaType('screen');
    const screenshot = await page.screenshot({ type: 'jpeg' })

    await browser.close();

    await this.producerService.produce('lesson-board.snapshot.created', {
      headers: {
        lessonBoardId: lessonBoardId.toString(),
        width: width.toString(),
        height: height.toString()
      },
      value: screenshot
    })
  }
}
