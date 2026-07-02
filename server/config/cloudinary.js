const cloudinary = require('cloudinary').v2;
const logger = require('../utils/logger');

require('dotenv').config();

const cloudName = (process.env.CLOUDINARY_CLOUD_NAME || '').trim();
const apiKey = (process.env.CLOUDINARY_API_KEY || '').trim();
const apiSecret = (process.env.CLOUDINARY_API_SECRET || '').trim();
const configured = Boolean(cloudName && apiKey && apiSecret);

logger.info('Cloudinary config check:', {
  cloud_name: cloudName || 'Missing',
  api_key: apiKey ? 'Set' : 'Missing',
  api_secret: apiSecret ? 'Set' : 'Missing',
});

if (configured) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });

  logger.info('Cloudinary configured successfully');
} else {
  logger.warn('Cloudinary configuration incomplete. Uploads will use local fallback.');
}

module.exports = cloudinary;
