
const { join } = require('path');

/**
 * @type {import("puppeteer").Configuration}
 */
module.exports = {
    // project-relative cache
    cacheDirectory: join(__dirname, '.cache', 'puppeteer'),
};