
const cloudinary = require('../config/cloudinary');
const logger = require('../utils/logger');

async function testCloudinary() {
    try {
        logger.info(' Testing Cloudinary upload...');
        

        const config = cloudinary.config();
        logger.info('Cloudinary config:', {
            cloud_name: config.cloud_name || 'NOT SET',
            api_key: config.api_key ? 'SET' : 'NOT SET',
            api_secret: config.api_secret ? 'SET' : 'NOT SET'
        });


        try {
            const result = await cloudinary.api.ping();
            logger.info(' API ping successful:', result);
        } catch (pingError) {
            logger.error(' API ping failed:', pingError.message);
            return false;
        }


        try {
            logger.info(' Testing upload with text file...');
            const testText = 'Hello Cloudinary! Test upload at ' + new Date().toISOString();
            const base64 = Buffer.from(testText).toString('base64');
            const dataURI = `data:text/plain;base64,${base64}`;
            
            const result = await cloudinary.uploader.upload(dataURI, {
                resource_type: 'raw',
                public_id: `test-upload-${Date.now()}`
            });
            
            logger.info('Upload successful!');
            logger.info('   URL:', result.secure_url);
            logger.info('   Public ID:', result.public_id);
            return true;
            
        } catch (uploadError) {
   
            logger.error(' Upload failed:', uploadError.message || 'Unknown error');
            
    
            logger.error('Upload error details:', {
                message: uploadError.message,
                http_code: uploadError.http_code,
                code: uploadError.code,
                error: uploadError.error,
                response: uploadError.response?.body,
                stack: uploadError.stack
            });
            

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
        logger.error(' Test failed:', error.message);
        logger.error('Stack:', error.stack);
        return false;
    }
}

testCloudinary().then(success => {
    logger.info(success ? 'Test completed successfully' : ' Test failed');
    process.exit(success ? 0 : 1);
});