const puppeteer = require('puppeteer');
const { generateCertificateHTML } = require('../templates/certificates/certificateGenerator');
const logger = require('../../logger');

/**
 * Generate premium certificate PDF
 * @param {Object} data - Certificate data
 * @param {string} data.userName - Recipient name
 * @param {string} data.sessionTitle - Session title
 * @param {string} data.skillArea - Skill area
 * @param {number} data.duration - Duration in minutes
 * @param {Date} data.completionDate - Completion date
 * @param {string} data.trainerName - Trainer name
 * @param {string} data.certCode - Certificate code
 * @param {Date} data.issueDate - Issue date
 * @param {string} data.verifyUrl - Verification URL
 * @param {string} [data.qrCode] - Optional QR code data URL
 * @returns {Promise<Buffer>} PDF buffer
 */
async function generateCertificatePDF(data) {
    let page = null;
    const browser = await getBrowser();

    try {
        logger.info(`Generating certificate PDF for: ${data.userName} (${data.certCode})`);

        // complete HTML with embedded CSS and data
        const html = await generateCertificateHTML(data);

        page = await browser.newPage();

        //  content with networkidle0  to ensure all resources load
        await page.setContent(html, {
            waitUntil: 'networkidle0',
            timeout: 30000
        });

        //  PDF with high quality settings
        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: {
                top: '0px',
                bottom: '0px',
                left: '0px',
                right: '0px'
            },
            preferCSSPageSize: true,
            displayHeaderFooter: false
        });

        logger.info(`PDF generated | Size: ${(pdfBuffer.length / 1024).toFixed(2)} KB`);

        return pdfBuffer;

    } catch (error) {
        logger.error(` PDF generation failed: ${error.message}`);
        throw new Error(`Failed to generate certificate PDF: ${error.message}`);
    } finally {
        if (page) {
            await page.close();
        }
    }
}

/**
 * Get or create browser instance (reuse across calls)
 */
let browserInstance = null;

async function getBrowser() {
    if (browserInstance && browserInstance.isConnected()) {
        return browserInstance;
    }

    logger.info('🚀 Launching Puppeteer browser');

    const args = [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',
        '--memory-pressure-off'
    ];

    if (process.env.NODE_ENV === 'production') {
        args.push('--max-old-space-size=512');
    }

    browserInstance = await puppeteer.launch({
        headless: 'new',
        args,
        defaultViewport: {
            width: 1200,
            height: 1600,
            deviceScaleFactor: 2
        }
    });

    browserInstance.on('disconnected', () => {
        logger.warn('⚠️ Puppeteer browser disconnected');
        browserInstance = null;
    });

    return browserInstance;
}

/**
 * Close browser instance (call on server shutdown)
 */
async function closeBrowser() {
    if (browserInstance) {
        await browserInstance.close();
        browserInstance = null;
        logger.info(' Puppeteer browser closed');
    }
}

/**
 * Generate test certificate and save to file
 */
async function generateTestCertificate(outputPath = './test-certificate.pdf') {
    const fs = require('fs');
    const path = require('path');

    const testData = {
        userName: 'John Michael Doe',
        sessionTitle: 'Advanced Full-Stack Development with React & Node.js',
        skillArea: 'Web Development',
        duration: 240,
        completionDate: new Date(),
        trainerName: 'Prof. Sarah Johnson',
        certCode: 'AICN-C17ACD9BAE450BE8',
        issueDate: new Date(),
        verifyUrl: 'https://aicn.africa/verify/AICN-C17ACD9BAE450BE8'
    };

    // Add QR code if available
    try {
        const { generateQRCode } = require('../../qrCodes/qrService');
        testData.qrCode = await generateQRCode(testData.verifyUrl);
    } catch (error) {
        logger.warn('QR code not included in test:', error.message);
    }

    const pdfBuffer = await generateCertificatePDF(testData);
    const fullPath = path.resolve(outputPath);
    fs.writeFileSync(fullPath, pdfBuffer);

    logger.info(` Test certificate saved to: ${fullPath}`);
    return fullPath;
}

module.exports = {
    generateCertificatePDF,
    generateTestCertificate,
    closeBrowser
};