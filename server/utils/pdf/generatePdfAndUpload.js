
const { generateCertificatePDF } = require('./generators/pdfGenerator');
const  uploadPdf  = require('../storage/uploadPdf');
const logger = require('../logger');

/**
 * Generate certificate PDF and upload to Cloudinary in one operation
 * @param {Object} certData - Certificate data
 * @param {string} certData.userName - Recipient name
 * @param {string} certData.sessionTitle - Session title
 * @param {string} certData.skillArea - Skill area
 * @param {number} certData.duration - Duration in minutes
 * @param {Date} certData.completionDate - Completion date
 * @param {string} certData.trainerName - Trainer name
 * @param {string} certData.certCode - Certificate code
 * @param {Date} certData.issueDate - Issue date
 * @param {string} certData.verifyUrl - Verification URL
 * @param {string} [certData.qrCode] - Optional QR code data URL
 * @param {string} certData.userId - User ID for folder
 * @param {string} certData.certificateId - Certificate ID for filename
 * @returns {Promise<{pdfBuffer: Buffer, uploadResult: Object}>}
 */
async function generatePdfAndUpload(certData) {
    const log = logger.child({ 
        module: 'pdf-orchestrator',
        certCode: certData.certCode,
        userId: certData.userId
    });

    try {
        log.info('Starting PDF generation and upload');

        // generate PDF
        const pdfBuffer = await generateCertificatePDF(certData);
        log.info(`PDF generated: ${(pdfBuffer.length / 1024).toFixed(2)} KB`);

        // upload to Cloudinary
        const uploadResult = await uploadPdf(
            pdfBuffer,
            certData.userId,
            certData.certificateId || certData.certCode
        );
        log.info(`PDF uploaded: ${uploadResult.secureUrl}`);

        return {
            pdfBuffer,
            uploadResult,
            success: true
        };
    } catch (error) {
        log.error(` Failed: ${error.message}`);
        throw error;
    }
}

module.exports = generatePdfAndUpload;