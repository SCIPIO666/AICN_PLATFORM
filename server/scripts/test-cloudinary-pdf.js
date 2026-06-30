// scripts/test-cloudinary-pdf.js
const fs = require('fs');
const path = require('path');
const cloudinary = require('../config/cloudinary');
const logger = require('../utils/logger');

async function testCloudinaryPdf() {
    try {
        logger.info('🔍 Testing Cloudinary upload with PDF...');
        
        // Find a PDF file
        const uploadsDir = path.join(__dirname, '../uploads/certificates');
        if (!fs.existsSync(uploadsDir)) {
            logger.error('❌ Uploads directory not found:', uploadsDir);
            return false;
        }
        
        const files = fs.readdirSync(uploadsDir);
        const pdfFiles = files.filter(f => f.endsWith('.pdf'));
        
        if (pdfFiles.length === 0) {
            logger.error('❌ No PDF files found');
            return false;
        }
        
        const latestPdf = pdfFiles[pdfFiles.length - 1];
        const pdfPath = path.join(uploadsDir, latestPdf);
        
        logger.info(`📄 Using PDF: ${latestPdf} (${(fs.statSync(pdfPath).size / 1024).toFixed(2)} KB)`);
        
        // Upload PDF file
        const result = await cloudinary.uploader.upload(pdfPath, {
            resource_type: 'raw',
            folder: 'certificates/test',
            public_id: `pdf-upload-${Date.now()}`,
            use_filename: true,
            access_mode: 'public'
        });
        
        logger.info('✅ PDF upload successful!');
        logger.info('   URL:', result.secure_url);
        logger.info('   Public ID:', result.public_id);
        logger.info('   Size:', (result.bytes / 1024).toFixed(2), 'KB');
        
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

testCloudinaryPdf().then(success => {
    process.exit(success ? 0 : 1);
});