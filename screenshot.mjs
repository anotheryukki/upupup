import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const url = process.argv[2] || 'http://localhost:3000';
const label = process.argv[3];

const outDir = path.join(__dirname, 'temporary screenshots');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const existing = fs.readdirSync(outDir);
let n = 1;
while (existing.some(f => f === `screenshot-${n}.png` || f.startsWith(`screenshot-${n}-`))) {
  n++;
}
const filename = label ? `screenshot-${n}-${label}.png` : `screenshot-${n}.png`;
const outPath = path.join(outDir, filename);

const browser = await puppeteer.launch({
  headless: true,
  executablePath: 'C:/Users/User/.cache/puppeteer/chrome/win64-148.0.7778.167/chrome-win64/chrome.exe',
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
await new Promise(r => setTimeout(r, 1000));
await page.screenshot({ path: outPath });
await browser.close();

console.log(`Saved ${outPath}`);
