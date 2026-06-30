// scripts/test-cloudinary-debug.js
const cloudinary = require('../config/cloudinary');
const logger = require('../utils/logger');

async function testCloudinaryDebug() {
    try {
        logger.info('🔍 Testing Cloudinary...');
        
        // 1. Check if cloudinary is loaded and configured
        const config = cloudinary.config();
        logger.info('Cloudinary config:', {
            cloud_name: config.cloud_name || 'NOT SET',
            api_key: config.api_key ? 'SET' : 'NOT SET',
            api_secret: config.api_secret ? 'SET' : 'NOT SET'
        });

        // 2. Test API ping
        try {
            logger.info('📡 Testing Cloudinary API ping...');
            const result = await cloudinary.api.ping();
            logger.info('✅ API ping successful:', result);
        } catch (pingError) {
            logger.error('❌ API ping failed:', pingError.message || 'Unknown error');
            logger.error('Ping error details:', {
                code: pingError.code,
                http_code: pingError.http_code,
                error: pingError.error,
                response: pingError.response?.body
            });
        }

        // 3. Test upload with a small text file
        try {
            logger.info('📤 Testing upload with text file...');
            const testText = 'Hello Cloudinary! Test upload at ' + new Date().toISOString();
            const base64 = Buffer.from(testText).toString('base64');
            const dataURI = `data:text/plain;base64,${base64}`;
            
            const result = await cloudinary.uploader.upload(dataURI, {
                resource_type: 'raw',
                public_id: `test-upload-${Date.now()}`
            });
            
            logger.info('✅ Upload successful!');
            logger.info('   URL:', result.secure_url);
            logger.info('   Public ID:', result.public_id);
            return true;
            
        } catch (uploadError) {
            logger.error('❌ Upload failed:', uploadError.message || 'Unknown error');
            
            // Log all error properties
            const errorDetails = {};
            for (const key of Object.keys(uploadError)) {
                errorDetails[key] = uploadError[key];
            }
            logger.error('Upload error details:', errorDetails);
            
            // Check if it's a network error
            if (uploadError.code === 'ECONNREFUSED' || uploadError.code === 'ENOTFOUND') {
                logger.error('💡 Network error: Cannot reach Cloudinary API. Check internet connection.');
            }
        }

        return false;
        
    } catch (error) {
        logger.error('❌ Test failed:', error.message);
        logger.error('Stack:', error.stack);
        return false;
    }
}

testCloudinaryDebug().then(success => {
    logger.info(success ? '✅ Test completed successfully' : '❌ Test failed');
    process.exit(success ? 0 : 1);
});