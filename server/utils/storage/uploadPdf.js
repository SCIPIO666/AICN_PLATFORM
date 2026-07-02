const cloudinary = require('../../config/cloudinary');
const fs = require('fs');
const path = require('path');
const logger = require('../logger');

const uploadsDir = path.join(__dirname, '../../uploads/certificates');
const cloudinaryCertificateFolder = (process.env.CLOUDINARY_CERTIFICATE_FOLDER || 'aicn_certificates').trim();

function isCloudinaryConfigured() {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );
}

function safeSegment(value) {
  return String(value || 'unknown').replace(/[^a-zA-Z0-9_-]/g, '-');
}

function uploadBufferToCloudinary(pdfBuffer, userId, certificateId) {
  const folder = `${safeSegment(cloudinaryCertificateFolder)}/${safeSegment(userId)}`;
  const filename = `certificate-${safeSegment(certificateId)}.pdf`;

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'raw',
        folder,
        public_id: filename,
        overwrite: true,
        unique_filename: false,
        use_filename: false,
        access_mode: 'public',
        context: {
          userId: String(userId),
          certificateId: String(certificateId),
        },
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    stream.end(pdfBuffer);
  });
}

async function uploadPdf(pdfBuffer, userId, certificateId) {
  if (!Buffer.isBuffer(pdfBuffer) || pdfBuffer.length === 0) {
    throw new Error('PDF buffer is empty or invalid');
  }

  if (!isCloudinaryConfigured()) {
    logger.warn('Cloudinary is not configured; saving certificate PDF locally');
    return saveLocally(pdfBuffer, userId, certificateId);
  }

  try {
    logger.info('Uploading certificate PDF to Cloudinary');
    const result = await uploadBufferToCloudinary(pdfBuffer, userId, certificateId);

    return {
      publicId: result.public_id,
      secureUrl: result.secure_url,
      url: result.url,
      version: Number(result.version || 1),
      format: result.format || 'pdf',
      resourceType: result.resource_type || 'raw',
      bytes: Number(result.bytes || pdfBuffer.length),
      createdAt: result.created_at || new Date().toISOString(),
      etag: result.etag || null,
      signature: result.signature || null,
      assetFolder: result.asset_folder || `${safeSegment(cloudinaryCertificateFolder)}/${safeSegment(userId)}`,
      originalFilename: result.original_filename || `certificate-${safeSegment(certificateId)}.pdf`,
      local: false,
      success: true,
    };
  } catch (error) {
    logger.error(`Cloudinary PDF upload failed: ${error.message}`);
    logger.warn('Falling back to local certificate PDF storage');
    return saveLocally(pdfBuffer, userId, certificateId);
  }
}

async function saveLocally(pdfBuffer, userId, certificateId) {
  await fs.promises.mkdir(uploadsDir, { recursive: true });

  const timestamp = Date.now();
  const filename = `certificate-${safeSegment(certificateId)}-${timestamp}.pdf`;
  const filePath = path.join(uploadsDir, filename);

  await fs.promises.writeFile(filePath, pdfBuffer);
  logger.info(`Certificate PDF saved locally: ${filename} (${(pdfBuffer.length / 1024).toFixed(2)} KB)`);

  return {
    publicId: `local-${safeSegment(certificateId)}-${timestamp}`,
    secureUrl: `/uploads/certificates/${filename}`,
    url: filePath,
    version: 1,
    format: 'pdf',
    resourceType: 'local',
    bytes: pdfBuffer.length,
    createdAt: new Date().toISOString(),
    etag: `local-${timestamp}`,
    signature: null,
    assetFolder: `local/certificates/${safeSegment(userId)}`,
    originalFilename: filename,
    local: true,
    filePath,
    filename,
    success: true,
  };
}

async function deletePdf(publicId) {
  try {
    if (publicId && publicId.startsWith('local-')) {
      logger.info(`Local PDF deletion requested: ${publicId}`);
      return { success: true, local: true };
    }

    const result = await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' });
    logger.info(`Cloudinary PDF deleted: ${publicId}`);
    return result;
  } catch (error) {
    logger.error(`Cloudinary PDF delete failed: ${error.message}`);
    throw error;
  }
}

module.exports = {
  uploadPdf,
  deletePdf,
};
