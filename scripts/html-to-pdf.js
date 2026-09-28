#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");

const [, , inputPath = "resume.html", outputPath = "resume.pdf"] = process.argv;

(async () => {
  const html = fs.readFileSync(path.resolve(inputPath), "utf8");
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });
    await page.pdf({
      path: path.resolve(outputPath),
      format: "A4",
      printBackground: true,
      margin: { top: "0", bottom: "0", left: "0", right: "0" },
    });
  } finally {
    await browser.close();
  }
  console.log(`Wrote ${outputPath}`);
})();
