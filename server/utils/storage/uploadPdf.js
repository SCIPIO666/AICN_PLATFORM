// utils/storage/uploadPdf.js - COMPLETE LOCAL STORAGE VERSION
const fs = require('fs');
const path = require('path');
const logger = require('../logger');

/**
 * Upload/save PDF locally (bypass Cloudinary for now)
 */
async function uploadPdf(pdfBuffer, userId, certificateId) {
    try {
        // Create upload directory
        const uploadDir = path.join(__dirname, '../../uploads/certificates');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
            logger.info(`📁 Created upload directory: ${uploadDir}`);
        }

        // Generate filename
        const timestamp = Date.now();
        const filename = `certificate-${certificateId}-${timestamp}.pdf`;
        const filePath = path.join(uploadDir, filename);

        // Save the PDF
        fs.writeFileSync(filePath, pdfBuffer);
        
        const fileSize = (pdfBuffer.length / 1024).toFixed(2);
        logger.info(`✅ PDF saved: ${filename} (${fileSize} KB)`);

        // Return consistent response structure
        return {
            publicId: `local-${certificateId}-${timestamp}`,
            secureUrl: `/uploads/certificates/${filename}`,
            url: filePath,
            bytes: pdfBuffer.length,
            format: 'pdf',
            resourceType: 'local',
            createdAt: new Date().toISOString(),
            local: true,
            filePath: filePath,
            filename: filename
        };
    } catch (error) {
        logger.error(`❌ PDF save error: ${error.message}`);
        throw new Error(`Failed to save PDF: ${error.message}`);
    }
}

module.exports = uploadPdf;