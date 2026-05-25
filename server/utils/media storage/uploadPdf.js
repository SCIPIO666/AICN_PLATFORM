const cloudinary = require('../../config/cloudinary');

const logger = require('../logger/logger');

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

  } catch (error) {

    logger.error(
      `PDF upload error: ${error.message}`
    );

    throw error;
  }
}

module.exports = uploadPdf;