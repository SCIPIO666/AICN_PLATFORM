
const cloudinary = require('cloudinary').v2;
const logger = require('../utils/logger');


require('dotenv').config();

const cloudName = (process.env.CLOUDINARY_CLOUD_NAME || '').trim();
const apiKey = (process.env.CLOUDINARY_API_KEY || '').trim();
const apiSecret = (process.env.CLOUDINARY_API_SECRET || '').trim();


logger.info('Cloudinary config check:', {
    cloud_name: cloudName || ' Missing',
    api_key: apiKey ? ' Set' : ' Missing',
    api_secret: apiSecret ? ' Set' : ' Missing'
});

// Only configure if we have all credentials
if (cloudName && apiKey && apiSecret) {

    cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret,
        secure: true
    });
    
    logger.info(' Cloudinary configured successfully');
    
    const config = cloudinary.config();
    logger.info('Cloudinary config verification:', {
        cloud_name: config.cloud_name || ' Not set',
        api_key: config.api_key ? ' Set' : ' Not set',
        api_secret: config.api_secret ? ' Set' : ' Not set'
    });
    
} else {
    logger.warn(' Cloudinary configuration incomplete. Uploads will use local fallback.');
    module.exports = {
        uploader: {
            upload: async (file, options) => {
                logger.warn(' Cloudinary not configured, but upload called. Use local fallback.');
                throw new Error('Cloudinary not configured');
            }
        },
        api: {
            ping: async () => {
                throw new Error('Cloudinary not configured');
            }
        },
        config: () => ({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret })
    };
    return;
}

module.exports = cloudinary;