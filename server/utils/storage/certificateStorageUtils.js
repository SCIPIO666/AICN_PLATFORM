const logger=require('../logger')
const prisma=require('../../config/db')
const { deletePdf } = require('./uploadPdf');


/**
 * Get certificate PDF details from database
 * @param {string} certificateId - Certificate ID
 * @returns {Promise<Object|null>} Certificate with PDF details
 */
async function getCertificatePDFDetails(certificateId) {
    try {
        const certificate = await prisma.certificate.findUnique({
            where: { id: certificateId },
            select: {
                pdfUrl: true,
                pdfPublicId: true,
                pdfSize: true,
                pdfVersion: true,
                pdfCreatedAt: true,
                certCode: true,
                userId: true
            }
        });

        return certificate;
    } catch (error) {
        logger.error(`Failed to get certificate PDF details: ${error.message}`);
        throw error;
    }
}

/**
 * Delete certificate PDF from Cloudinary and database
 * @param {string} certificateId - Certificate ID
 * @returns {Promise<void>}
 */
async function deleteCertificatePDF(certificateId) {
    try {
        const certificate = await prisma.certificate.findUnique({
            where: { id: certificateId },
            select: { pdfPublicId: true }
        });

        if (certificate?.pdfPublicId) {
            // Cloudinary delete
            await deletePdf(certificate.pdfPublicId);

            // from database
            await prisma.certificate.update({
                where: { id: certificateId },
                data: {
                    pdfUrl: null,
                    pdfPublicId: null,
                    pdfSize: null,
                    pdfVersion: null,
                    pdfCreatedAt: null
                }
            });

            logger.info(` Certificate PDF deleted: ${certificateId}`);
        } else {
            logger.info(`No PDF to delete for certificate: ${certificateId}`);
        }
    } catch (error) {
        logger.error(`Failed to delete certificate PDF: ${error.message}`);
        throw error;
    }
}

module.exports = {
    getCertificatePDFDetails,
    deleteCertificatePDF
};