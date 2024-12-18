import puppeteer, { Browser, Page } from "puppeteer";

let browser: Browser;
let page: Page;

beforeEach(async () => {
  browser = await puppeteer.launch({
    headless: false,
  });
  page = await browser.newPage();
  await page.goto("http://localhost:3000");
});

afterEach(async () => {
  await browser.close();
});

test("We can launch a browser", async () => {
  await page.screenshot({ path: "example.png" });
});
