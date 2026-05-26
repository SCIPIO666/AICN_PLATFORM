// uploadPdf.js - Modified to accept buffer
const cloudinary = require('../../config/cloudinary');
const logger = require('../logger');
const stream = require('stream');

/**
 * Upload PDF to Cloudinary
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @param {string|number} userId - User ID for folder organization
 * @param {string} certificateId - Certificate ID for filename
 * @returns {Promise<Object>} Cloudinary upload result
 */
async function uploadPdf(pdfBuffer, userId, certificateId) {
  try {
    // Upload buffer to cloudinary using stream
    const uploadStream = () => {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: `certificates/${userId}`,
            resource_type: 'raw',
            public_id: `certificate-${certificateId}-${Date.now()}`,
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        
        // Create readable stream from buffer and pipe to cloudinary
        const bufferStream = new stream.PassThrough();
        bufferStream.end(pdfBuffer);
        bufferStream.pipe(uploadStream);
      });
    };
    
    const result = await uploadStream();
    
    logger.info(`PDF uploaded to Cloudinary: ${result.secure_url}`);
    
    return result;
  } catch (error) {
    logger.error(`PDF upload error: ${error.message}`);
    throw error;
  }
}

module.exports = uploadPdf;