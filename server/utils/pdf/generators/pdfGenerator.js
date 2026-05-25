const puppeteer = require('puppeteer');
const { generateCertificateHTML } = require('../templates/certificates/certificateGenerator');
const logger = require('../../logger/logger');

// Browser pool for production
class BrowserPool {
    constructor() {
        this.browser = null;
        this.isLaunching = false;
        this.launchPromise = null;
    }
    
    async getBrowser() {
        if (this.browser) {
            return this.browser;
        }
        
        if (this.isLaunching) {
            return await this.launchPromise;
        }
        
        this.isLaunching = true;
        this.launchPromise = this.launchBrowser();
        
        try {
            this.browser = await this.launchPromise;
            return this.browser;
        } finally {
            this.isLaunching = false;
            this.launchPromise = null;
        }
    }
    
    async launchBrowser() {
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
        
        const browser = await puppeteer.launch({
            headless: 'new',
            args,
            defaultViewport: {
                width: 1200,
                height: 1600,
                deviceScaleFactor: 2
            }
        });
        
        return browser;
    }
    
    async closeBrowser() {
        if (this.browser) {
            await this.browser.close();
            this.browser = null;
        }
    }
}

const browserPool = new BrowserPool();

/**
 * Generate premium certificate PDF
 * @param {Object} data - Certificate data
 * @returns {Promise<Buffer>} PDF buffer
 */
async function generateCertificatePDF(data) {
    let page = null;
    
    try {
        logger.info(`🎓 Generating premium certificate for: ${data.userName} (${data.certCode})`);
        
        // Generate complete HTML with embedded CSS and data
        const html = await generateCertificateHTML(data);
        
        // Get browser from pool
        const browser = await browserPool.getBrowser();
        page = await browser.newPage();
        
        // Set content with networkidle0 to ensure all fonts load
        await page.setContent(html, {
            waitUntil: 'networkidle0',
            timeout: 30000
        });
        
        // Generate PDF with high quality settings
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
        
        logger.info(`✅ PDF generated successfully | Size: ${(pdfBuffer.length / 1024).toFixed(2)} KB`);
        
        return pdfBuffer;
        
    } catch (error) {
        logger.error(`❌ PDF generation failed: ${error.message}`);
        throw new Error(`Failed to generate certificate PDF: ${error.message}`);
    } finally {
        if (page) {
            await page.close();
        }
    }
}

/**
 * Generate certificate for testing (saves to file)
 */
async function generateTestCertificate(outputPath = './test-certificate.pdf') {
    const fs = require('fs');
    
    const testData = {
        userName: 'John Michael Doe',
        sessionTitle: 'Advanced Full-Stack Development with React & Node.js',
        skillArea: 'Web Development',
        duration: 240,
        completionDate: new Date(),
        trainerName: 'Prof. Sarah Johnson',
        certCode: 'AICN-FS-2024-001234',
        issueDate: new Date(),
        verifyUrl: 'https://aicn.com/verify/AICN-FS-2024-001234'
    };
    
    const pdfBuffer = await generateCertificatePDF(testData);
    fs.writeFileSync(outputPath, pdfBuffer);
    logger.info(`📄 Test certificate saved to: ${outputPath}`);
    return outputPath;
}

module.exports = {
    generateCertificatePDF,
    generateTestCertificate,
    browserPool
};