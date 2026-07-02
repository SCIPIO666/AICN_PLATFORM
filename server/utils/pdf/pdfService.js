const fs           = require('fs');
const path          = require('path');
const handlebars     = require('handlebars');
const { getBrowser } = require('../../config/puppeteer');
const logger          = require('../logger');
 
const log = logger.child({ module: 'pdf' });
 
const templateCache = {};
const compileTemplate = (name) => {
  if (templateCache[name]) return templateCache[name];
  const filePath = path.join(__dirname, "templates", `${name}.hbs`);
  const compiled  = handlebars.compile(fs.readFileSync(filePath, "utf-8"));
  templateCache[name] = compiled;
  return compiled;
};
 
//  CORE: HTML STRING → PDF BUFFER 
const renderPdfFromHtml = async (html, options = {}) => {
  const browser = await getBrowser();
  const page    = await browser.newPage();
 
  try {
    await page.setContent(html, { waitUntil: "networkidle0" });
 
    const pdfBuffer = await page.pdf({
      format:      options.format || "A4",
      landscape:   options.landscape ?? true,
      printBackground: true,    // required to render gradients/colors
      timeout:     options.timeout || 15000,
    });
 
    return pdfBuffer;
  } finally {
    await page.close();   // always close the page, even on error
  }
};
 
// ── CERTIFICATE GENERATOR ────────────────────────────────────────────
const generateCertificatePdf = async ({ learnerName, sessionTitle, issuedDate, verifyToken }) => {
  const compiled = compileTemplate("certificate");
  const html     = compiled({ learnerName, sessionTitle, issuedDate, verifyToken });
 
  const start  = Date.now();
  const buffer = await renderPdfFromHtml(html, { landscape: true });
 
  log.info({ learnerName, sessionTitle, durationMs: Date.now() - start },
    "Certificate PDF generated");
 
  return buffer;
};
 
module.exports = { renderPdfFromHtml, generateCertificatePdf };
