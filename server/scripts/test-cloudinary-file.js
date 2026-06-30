// scripts/test-cloudinary-file.js
const fs = require('fs');
const path = require('path');
const cloudinary = require('../config/cloudinary');
const logger = require('../utils/logger');

async function testCloudinaryFile() {
    try {
        logger.info('🔍 Testing Cloudinary upload with file...');
        
        // Create a temporary text file
        const tempDir = path.join(__dirname, '../temp');
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir);
        }
        
        const tempFile = path.join(tempDir, 'test.txt');
        fs.writeFileSync(tempFile, 'Hello Cloudinary! Test upload at ' + new Date().toISOString());
        
        logger.info('📄 Created test file:', tempFile);
        
        // Upload the file
        const result = await cloudinary.uploader.upload(tempFile, {
            resource_type: 'raw',
            folder: 'test',
            public_id: 'test-file-' + Date.now(),
            use_filename: true
        });
        
        logger.info('✅ Upload successful!');
        logger.info('   URL:', result.secure_url);
        logger.info('   Public ID:', result.public_id);
        logger.info('   Size:', result.bytes, 'bytes');
        
        // Clean up
        fs.unlinkSync(tempFile);
        
        return true;
    } catch (error) {
        logger.error('❌ Upload failed:', error.message);
        logger.error('Error details:', {
            http_code: error.http_code,
            code: error.code,
            error: error.error,
            response: error.response?.body
        });
        return false;
    }
}

testCloudinaryFile().then(success => {
    process.exit(success ? 0 : 1);
});