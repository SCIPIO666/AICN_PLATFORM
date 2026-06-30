const puppeteer = require('puppeteer');
const logger    = require('../utils/logger');
 
let browserInstance = null;
 
// Launch flags 
const LAUNCH_OPTIONS = {
  headless: "new",
  args: [
    '--no-sandbox',                  
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',    
    '--disable-gpu',
    '--single-process',             
  ],
};
 
const getBrowser = async () => {
  if (browserInstance && browserInstance.isConnected()) return browserInstance;
 
  logger.info("Launching Puppeteer browser instance");
  browserInstance = await puppeteer.launch(LAUNCH_OPTIONS);
 
  browserInstance.on("disconnected", () => {
    logger.warn("Puppeteer browser disconnected — will relaunch on next use");
    browserInstance = null;
  });
 
  return browserInstance;
};
 
const closeBrowser = async () => {
  if (browserInstance) {
    await browserInstance.close();
    browserInstance = null;
  }
};
 
module.exports = { getBrowser, closeBrowser };
