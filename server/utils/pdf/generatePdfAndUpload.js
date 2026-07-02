const { generateCertificatePDF } = require('./generators/pdfGenerator');
const { uploadPdf } = require('../storage/uploadPdf');
const logger = require('../logger');

async function generatePdfAndUpload(certData) {
  const log = logger.child({
    module: 'certificate-pdf',
    certCode: certData.certCode,
    userId: certData.userId,
  });

  log.info('Generating certificate PDF');
  const pdfBuffer = await generateCertificatePDF(certData);
  log.info(`Certificate PDF generated: ${(pdfBuffer.length / 1024).toFixed(2)} KB`);

  const uploadResult = await uploadPdf(
    pdfBuffer,
    certData.userId,
    certData.certificateId || certData.certCode
  );

  log.info(`Certificate PDF stored: ${uploadResult.secureUrl}`);

  return {
    pdfBuffer,
    uploadResult,
    success: true,
  };
}

module.exports = generatePdfAndUpload;
