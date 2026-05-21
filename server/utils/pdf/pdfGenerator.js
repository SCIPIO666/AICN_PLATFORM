const puppeteer = require('puppeteer');
const QRCode = require('qrcode');
const path = require('path');
const logger = require('../logger');

// HTML template- certificate
const getCertificateHTML = (data) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Certificate of Completion - ${data.userName}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Playfair+Display:wght@400;600&display=swap');
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Playfair Display', serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          padding: 40px;
        }
        
        .certificate {
          width: 1000px;
          background: white;
          padding: 50px;
          border-radius: 20px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
          position: relative;
          overflow: hidden;
        }
        
        .border {
          border: 3px solid #667eea;
          padding: 30px;
          position: relative;
        }
        
        .logo {
          text-align: center;
          margin-bottom: 30px;
        }
        
        .logo h1 {
          font-family: 'Cinzel', serif;
          font-size: 36px;
          color: #667eea;
          letter-spacing: 4px;
        }
        
        .cert-title {
          text-align: center;
          margin: 30px 0;
        }
        
        .cert-title h2 {
          font-family: 'Cinzel', serif;
          font-size: 48px;
          color: #333;
        }
        
        .recipient {
          text-align: center;
          margin: 40px 0;
        }
        
        .recipient h3 {
          font-size: 48px;
          color: #667eea;
          border-bottom: 2px solid #e5e7eb;
          display: inline-block;
          padding-bottom: 10px;
        }
        
        .course {
          text-align: center;
          margin: 30px 0;
        }
        
        .course h4 {
          font-size: 24px;
          color: #333;
          margin-bottom: 15px;
        }
        
        .course-details {
          display: flex;
          justify-content: center;
          gap: 30px;
          margin-top: 20px;
          flex-wrap: wrap;
        }
        
        .detail-item {
          background: #f3f4f6;
          padding: 10px 20px;
          border-radius: 8px;
        }
        
        .detail-item strong {
          color: #667eea;
        }
        
        .footer {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-top: 50px;
          padding-top: 30px;
          border-top: 1px solid #e5e7eb;
        }
        
        .signature-line {
          width: 200px;
          height: 1px;
          background: #333;
          margin: 10px auto;
        }
        
        .qr-code {
          text-align: center;
        }
        
        .qr-code img {
          width: 100px;
          height: 100px;
        }
        
        .cert-code {
          text-align: center;
          margin-top: 20px;
          font-size: 12px;
          color: #999;
        }
        
        @media print {
          body {
            background: white;
            padding: 0;
          }
          .certificate {
            box-shadow: none;
          }
        }
      </style>
    </head>
    <body>
      <div class="certificate">
        <div class="border">
          <div class="logo">
            <h1>AICN</h1>
            <p>Africa Institute of Computer Networking</p>
          </div>
          
          <div class="cert-title">
            <h2>CERTIFICATE OF COMPLETION</h2>
            <p>This certificate is proudly presented to</p>
          </div>
          
          <div class="recipient">
            <h3>${data.userName}</h3>
          </div>
          
          <div class="course">
            <h4>For successfully completing</h4>
            <h4 style="color: #667eea;">${data.sessionTitle}</h4>
            <div class="course-details">
              <div class="detail-item"><strong>Skill Area:</strong> ${data.skillArea}</div>
              <div class="detail-item"><strong>Duration:</strong> ${data.duration} minutes</div>
              <div class="detail-item"><strong>Date:</strong> ${new Date(data.sessionDate).toLocaleDateString()}</div>
            </div>
          </div>
          
          <div class="footer">
            <div class="signature">
              <div class="signature-line"></div>
              <p>${data.trainerName}</p>
              <p style="font-size: 12px;">Lead Trainer</p>
            </div>
            <div class="signature">
              <div class="signature-line"></div>
              <p>AICN Director</p>
              <p style="font-size: 12px;">Africa Institute of Computer Networking</p>
            </div>
            <div class="qr-code">
              <img src="${data.qrCodeDataUrl}" alt="Verification QR Code">
              <p style="font-size: 10px;">Scan to verify</p>
            </div>
          </div>
          
          <div class="cert-code">
            <p>Certificate ID: ${data.certCode}</p>
            <p>Issue Date: ${new Date(data.issueDate).toLocaleDateString()}</p>
            <p>Verify at: ${data.verifyUrl}</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};

/**
 * Generate PDF certificate
 * @param {Object} data - Certificate data
 * @returns {Promise<Buffer>} PDF buffer
 */

const getBrowserArgs = () => {
  if (process.env.NODE_ENV === 'production') {
    return [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--disable-gpu',
      '--memory-pressure-off',
      '--max-old-space-size=512'
    ];
  }
  return ['--no-sandbox', '--disable-setuid-sandbox'];
};

// Use a browser pool for production
class BrowserPool {
  constructor() {
    this.browser = null;
  }
  
  async getBrowser() {
    if (!this.browser) {
      this.browser = await puppeteer.launch({
        headless: 'new',
        args: getBrowserArgs()
      });
    }
    return this.browser;
  }
  
  async close() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }
}

const browserPool = new BrowserPool();
const generateCertificatePDF = async (data) => {
  let browser = await browserPool.getBrowser();
   const page = await browser.newPage();
  try {
    logger.info(`Generating PDF for certificate: ${data.certCode}`);
    
    // Generate QR code as data URL
    const qrCodeDataUrl = await QRCode.toDataURL(data.verifyUrl, {
      errorCorrectionLevel: 'H',
      margin: 1,
      width: 200
    });
    
    // Prepare HTML with QR code
    const html = getCertificateHTML({
      ...data,
      qrCodeDataUrl
    });
    
    // Launch puppeteer
    browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu'
      ]
    });
    
    const page = await browser.newPage();
    
    // Set content and wait for fonts/images to load
    await page.setContent(html, {
      waitUntil: 'networkidle0'
    });
    
    // Generate PDF
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20px',
        bottom: '20px',
        left: '20px',
        right: '20px'
      }
    });
    
    logger.info(`PDF generated successfully for ${data.certCode}, size: ${pdfBuffer.length} bytes`);
    return pdfBuffer;
    
  } catch (error) {
    logger.error(`PDF generation failed: ${error.message}`);
    throw new Error(`Failed to generate certificate PDF: ${error.message}`);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};

/**
 * Generate batch PDFs for multiple certificates
 */
const generateBatchCertificates = async (certificatesData) => {
  const results = {
    successful: [],
    failed: []
  };
  
  for (const data of certificatesData) {
    try {
      const pdfBuffer = await generateCertificatePDF(data);
      results.successful.push({
        certCode: data.certCode,
        pdfBuffer
      });
    } catch (error) {
      results.failed.push({
        certCode: data.certCode,
        error: error.message
      });
    }
  }
  
  return results;
};

module.exports = {
  generateCertificatePDF,
  generateBatchCertificates
};