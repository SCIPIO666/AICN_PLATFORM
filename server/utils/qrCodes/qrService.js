const QRCode = require('qrcode');

async function generateQRCode(data) {

  try {

    const qrCode =
      await QRCode.toDataURL(data);

    return qrCode;

  } catch (error) {

    throw new Error(
      `QR generation failed: ${error.message}`
    );
  }
}

module.exports = {
  generateQRCode,
};