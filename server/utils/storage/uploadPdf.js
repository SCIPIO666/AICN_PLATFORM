// uploadPdf.js
const cloudinary = require('../../config/cloudinary');
const logger = require('../logger');

/**
 * Upload PDF buffer directly to Cloudinary
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @param {string|number} userId - User ID for folder organization
 * @param {string} certificateId - Certificate ID for filename
 * @returns {Promise<Object>} Cloudinary upload result with all metadata
 */
async function uploadPdf(pdfBuffer, userId, certificateId) {
  try {
    // Convert buffer to base64
    const base64String = pdfBuffer.toString('base64');
    const dataURI = `data:application/pdf;base64,${base64String}`;
    
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: `certificates/${userId}`,
      resource_type: 'raw',
      public_id: `certificate-${certificateId}-${Date.now()}`,
      format: 'pdf',
      use_filename: true,
      unique_filename: true
    });
    
    logger.info(`PDF uploaded to Cloudinary: ${result.secure_url}`);
    

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
      originalFilename: result.original_filename
    };
  } catch (error) {
    logger.error(`PDF upload error: ${error.message}`);
    throw error;
  }
}

module.exports = uploadPdf;