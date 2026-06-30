// const cloudinary = require('../../config/cloudinary');
// const logger = require('../logger');

// /**
//  * Upload PDF buffer directly to Cloudinary
//  * @param {Buffer} pdfBuffer - PDF file buffer
//  * @param {string|number} userId - User ID for folder organization
//  * @param {string} certificateId - Certificate ID for filename
//  * @returns {Promise<Object>} Cloudinary upload result with all metadata
//  */
// async function uploadPdf(pdfBuffer, userId, certificateId) {
//   try {
//     //  buffer to base64
//     const base64String = pdfBuffer.toString('base64');
//     const dataURI = `data:application/pdf;base64,${base64String}`;
    
//     const result = await cloudinary.uploader.upload(dataURI, {
//       folder: `certificates/${userId}`,
//       resource_type: 'raw',
//       public_id: `certificate-${certificateId}-${Date.now()}`,
//       format: 'pdf',
//       use_filename: true,
//       unique_filename: true
//     });
    
//     logger.info(`PDF uploaded to Cloudinary: ${result.secure_url}`);
    

//     return {
//       publicId: result.public_id,
//       secureUrl: result.secure_url,
//       url: result.url,
//       version: result.version,
//       format: result.format,
//       resourceType: result.resource_type,
//       bytes: result.bytes,
//       createdAt: result.created_at,
//       etag: result.etag,
//       signature: result.signature,
//       assetFolder: result.asset_folder,
//       originalFilename: result.original_filename
//     };
//   } catch (error) {
//     logger.error(`PDF upload error: ${error.message}`);
//     throw error;
//   }
// }

// module.exports = uploadPdf;

// utils/storage/uploadPdf.js
const cloudinary = require('../../config/cloudinary');
const fs = require('fs');
const path = require('path');
const logger = require('../logger');

/**
 * Upload PDF buffer directly to Cloudinary using data URI
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @param {string} userId - User ID for folder organization
 * @param {string} certificateId - Certificate ID for filename
 * @returns {Promise<Object>} Cloudinary upload result or local fallback
 */
async function uploadPdf(pdfBuffer, userId, certificateId) {
    try {
        // Check if Cloudinary is configured
        if (!process.env.CLOUDINARY_CLOUD_NAME || 
            !process.env.CLOUDINARY_API_KEY || 
            !process.env.CLOUDINARY_API_SECRET) {
            logger.warn('⚠️ Cloudinary not configured, saving locally');
            return await saveLocally(pdfBuffer, userId, certificateId);
        }

        // Convert buffer to base64 data URI
        const base64String = pdfBuffer.toString('base64');
        const dataURI = `data:application/pdf;base64,${base64String}`;

        logger.info('📤 Uploading PDF to Cloudinary...');

        // Upload using data URI
        const result = await cloudinary.uploader.upload(dataURI, {
            folder: `certificates/${userId}`,
            resource_type: 'raw',
            public_id: `certificate-${certificateId}`,
            format: 'pdf',
            use_filename: true,
            unique_filename: true,
            access_mode: 'public',
            context: {
                userId: userId,
                certificateId: certificateId
            }
        });

        logger.info(`✅ PDF uploaded to Cloudinary: ${result.secure_url}`);

        return {
            publicId: result.public_id,
            secureUrl: result.secure_url,
            url: result.url,
            version: result.version,
            format: result.format,
            resourceType: result.resource_type,
            bytes: result.bytes,
            createdAt: result.created_at,
            etag: result.etag,
            signature: result.signature,
            assetFolder: result.asset_folder,
            originalFilename: result.original_filename,
            local: false
        };
    } catch (error) {
        logger.error(`❌ Cloudinary upload error: ${error.message}`);
        logger.warn('⚠️ Falling back to local storage');
        return await saveLocally(pdfBuffer, userId, certificateId);
    }
}

/**
 * Save PDF locally as fallback
 */
async function saveLocally(pdfBuffer, userId, certificateId) {
    try {
        const uploadDir = path.join(__dirname, '../../uploads/certificates');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
            logger.info(`📁 Created upload directory: ${uploadDir}`);
        }

        const timestamp = Date.now();
        const filename = `certificate-${certificateId}-${timestamp}.pdf`;
        const filePath = path.join(uploadDir, filename);

        fs.writeFileSync(filePath, pdfBuffer);
        
        const fileSize = (pdfBuffer.length / 1024).toFixed(2);
        logger.info(`✅ PDF saved locally: ${filename} (${fileSize} KB)`);

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