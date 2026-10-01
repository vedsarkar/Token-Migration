// Renders the dashboard at the Figma frame size so the result can be diffed
// against the design export. Usage: `npm run shot` with the dev server running.
import puppeteer from 'puppeteer-core';

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const URL = process.env.URL || 'http://localhost:3040/Profile_stats';

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--no-sandbox', '--hide-scrollbars'],
});

const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
await page.goto(URL, { waitUntil: 'networkidle0' });
// Outlast the chart entry animations so shots capture the settled state.
await new Promise((r) => setTimeout(r, 2500));
await page.screenshot({ path: 'tools/page.png' });

await page.setViewport({ width: 1440, height: 1200, deviceScaleFactor: 2 });
await new Promise((r) => setTimeout(r, 1500));
await page.screenshot({ path: 'tools/page-tall.png' });

await browser.close();
console.log('wrote tools/page.png and tools/page-tall.png');
