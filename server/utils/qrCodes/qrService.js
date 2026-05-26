const QRCode = require('qrcode');

/**
 * Generate QR code as data URL
 * @param {string} text - Text or URL to encode in QR code
 * @returns {Promise<string>} Data URL of the QR code image
 */
async function generateQRCode(text) {
  try {
    const qrCode = await QRCode.toDataURL(text, {
      errorCorrectionLevel: 'H',  // High error correction (30% damage tolerance)
      margin: 2,                   // 2 modules margin
      width: 200,                  // 200px width
      color: {
            dark: '#d97706',     // Gold color
            light: '#ffffff'     // White background
      }
    });

    return qrCode;
  } catch (error) {
    throw new Error(`QR generation failed: ${error.message}`);
  }
}

/**
 * Generate QR code as buffer (useful for PDF generation)
 * @param {string} text - Text or URL to encode in QR code
 * @returns {Promise<Buffer>} Buffer containing QR code image
 */
async function generateQRCodeBuffer(text) {
  try {
    const qrBuffer = await QRCode.toBuffer(text, {
      errorCorrectionLevel: 'H',
      margin: 2,
      width: 200,
      color: {
        dark: '#1a1a2e',
        light: '#ffffff'
      }
    });

    return qrBuffer;
  } catch (error) {
    throw new Error(`QR generation failed: ${error.message}`);
  }
}

/**
 * Generate QR code as base64 string (without data:image prefix)
 * @param {string} text - Text or URL to encode in QR code
 * @returns {Promise<string>} Base64 string of QR code
 */
async function generateQRCodeBase64(text) {
  try {
    const dataUrl = await QRCode.toDataURL(text, {
      errorCorrectionLevel: 'H',
      margin: 2,
      width: 200,
      color: {
         dark: '#d97706', 
         light: '#ffffff'     
      }
    });
    
    // Remove the data:image/png;base64, prefix if needed
    return dataUrl.split(',')[1];
  } catch (error) {
    throw new Error(`QR generation failed: ${error.message}`);
  }
}

module.exports = {
  generateQRCode,        // Main function returning data URL
  generateQRCodeBuffer,  // Returns buffer (for PDFs)
  generateQRCodeBase64   // Returns raw base64 string
};