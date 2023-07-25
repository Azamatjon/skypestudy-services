import express, {Express, Request, Response, json } from 'express';
import * as puppeteer from "puppeteer";

const app: Express = express();
app.use(json());

const port = process.env.PORT ?? 3000;

console.log('port', port)
app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

app.get('/screenshot', async (req: Request, res: Response) => {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: process.env.EXECUTABLE_PATH,
    args: [
      "--no-sandbox",
      "--disable-gpu",
    ]
  });

  const page = await browser.newPage();
  // Navigate the page to a URL
  const url = process.env.SNAPSHOT_HOST
  await page.goto(`${req.query.uri}`, { waitUntil: 'networkidle0' });

  // Set screen size
  await page.setViewport({width: 1080, height: 1024});

  // To reflect CSS used for screens instead of print
  await page.emulateMediaType('screen');
  const screenshot = await page.screenshot({ type: 'jpeg' })

  await browser.close();
  res.send(screenshot)
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
