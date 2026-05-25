const cloudinary = require('../../config/cloudinary');

const logger = require('../logger');

async function uploadPdf(filePath, userId) {

  try {

    const result =
      await cloudinary.uploader.upload(
        filePath,
        {
          folder: `certificates/${userId}`,
          resource_type: 'raw',
          public_id: `certificate-${Date.now()}`,
        }
      );

    return result;
    //   /**
    //  * Cloudinary Upload Response Object (result):
    //  * 
    //  * @returns {Object} result - The upload response from Cloudinary
    //  * 
    //  * @property {string} public_id - Unique identifier
    //  *   Example: "certificates/user123/certificate-1748160000000"
    //  * 
    //  * @property {string} secure_url - HTTPS delivery URL (recommended for production)
    //  *   Example: "https://res.cloudinary.com/your-cloud/raw/upload/v1748160000/..."
    //  * 
    //  * @property {string} url - HTTP delivery URL (plaintext)
    //  *   Example: "http://res.cloudinary.com/your-cloud/raw/upload/v1748160000/..."
    //  * 
    //  * @property {number} version - Version timestamp for cache busting
    //  *   Example: 1748160000
    //  * 
    //  * @property {string} format - File format
    //  *   Example: "pdf"
    //  * 
    //  * @property {string} resource_type - Type of asset ("image", "video", or "raw")
    //  *   Example: "raw"
    //  * 
    //  * @property {number} bytes - File size in bytes
    //  *   Example: 245760
    //  * 
    //  * @property {string} created_at - ISO 8601 timestamp of upload
    //  *   Example: "2026-05-25T10:30:00Z"
    //  * 
    //  * @property {string} original_filename - Original name of uploaded file
    //  *   Example: "document.pdf"
    //  * 
    //  * @property {string} etag - ETag for cache validation
    //  *   Example: "5d41402abc4b2a76b9719d911017c592"
    //  * 
    //  * @property {string} signature - Authentication signature
    //  * 
    //  * @property {string} type - Upload type
    //  *   Example: "upload"
    //  * 
    //  * @property {string} asset_folder - Asset folder path
    //  *   Example: "certificates/user123"
    //  * 
    //  * @property {string} display_name - Display name of the asset
    //  * 
    //  * Usage:
    //  * - Store result.public_id in database for future operations
    //  * - Save result.secure_url as the accessible link for users
    //  * - Use result.bytes to track storage usage
    //  * - Log result.created_at for audit trails


  } catch (error) {

    logger.error(
      `PDF upload error: ${error.message}`
    );

    throw error;
  }
}

module.exports = uploadPdf;