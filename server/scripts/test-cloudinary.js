// scripts/test-cloudinary.js - Fixed version
const cloudinary = require('../config/cloudinary');
const logger = require('../utils/logger');

async function testCloudinary() {
    try {
        logger.info('🔍 Testing Cloudinary upload...');
        
        // 1. Check configuration
        const config = cloudinary.config();
        logger.info('Cloudinary config:', {
            cloud_name: config.cloud_name || 'NOT SET',
            api_key: config.api_key ? 'SET' : 'NOT SET',
            api_secret: config.api_secret ? 'SET' : 'NOT SET'
        });

        // 2. Test API ping (already working)
        try {
            const result = await cloudinary.api.ping();
            logger.info('✅ API ping successful:', result);
        } catch (pingError) {
            logger.error('❌ API ping failed:', pingError.message);
            return false;
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
            // ✅ FIX: Properly log the error
            logger.error('❌ Upload failed:', uploadError.message || 'Unknown error');
            
            // Log all properties of the error
            logger.error('Upload error details:', {
                message: uploadError.message,
                http_code: uploadError.http_code,
                code: uploadError.code,
                error: uploadError.error,
                response: uploadError.response?.body,
                stack: uploadError.stack
            });
            
            // Check for specific error types
            if (uploadError.http_code === 403) {
                logger.error('💡 HTTP 403: Forbidden - Check your Cloudinary API key permissions');
            } else if (uploadError.http_code === 400) {
                logger.error('💡 HTTP 400: Bad Request - Check the upload parameters');
            } else if (uploadError.code === 'ECONNREFUSED' || uploadError.code === 'ENOTFOUND') {
                logger.error('💡 Network error: Cannot reach Cloudinary API');
            }
            
            return false;
        }
        
    } catch (error) {
        logger.error('❌ Test failed:', error.message);
        logger.error('Stack:', error.stack);
        return false;
    }
}

testCloudinary().then(success => {
    logger.info(success ? '✅ Test completed successfully' : '❌ Test failed');
    process.exit(success ? 0 : 1);
});