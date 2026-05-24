const puppeteer = require('puppeteer');

let browser;

async function getBrowser() {

  if (browser) return browser;

  browser = await puppeteer.launch({

    headless: true,

    executablePath:
      'C:\\Users\\c\\.cache\\puppeteer\\chrome\\win64-148.0.7778.167\\chrome-win64\\chrome.exe',

    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
    ],
  });

  return browser;
}

module.exports = getBrowser;