const getBrowser = require('../browser/browser');
const puppeteer = require('puppeteer');
// const { generateCertificatePDF } = require('../pdfGenerator');

async function generatePdf(html) {
  const browser = await getBrowser();

  const page = await browser.newPage();

  await page.setContent(html, {
    waitUntil: 'networkidle0',
  });

  const pdfBuffer = await page.pdf({
    format: 'A4',
    printBackground: true,
  });

  await page.close();

  return pdfBuffer;
}


module.exports = {
  generatePdf
};