
const generatePdfAndUpload = require('../utils/pdf/generatePdfAndUpload');
const logger = require('../utils/logger');

async function testPipeline() {
    logger.info(' Testing PDF generation & upload pipeline...');

    const testData = {
        userName: 'John Michael Doe',
        sessionTitle: 'Advanced Full-Stack Development with React & Node.js',
        skillArea: 'Web Development',
        duration: 240,
        completionDate: new Date(),
        trainerName: 'Prof. Sarah Johnson',
        certCode: 'AICN-FS-2024-001234',
        issueDate: new Date(),
        verifyUrl: 'https://aicn.africa/verify/AICN-FS-2024-001234',
        userId: 'test-user-123',
        certificateId: 'test-cert-456'
    };

    try {
        const result = await generatePdfAndUpload(testData);
        logger.info(' Pipeline test successful!');
        logger.info(`   PDF Size: ${(result.pdfBuffer.length / 1024).toFixed(2)} KB`);
        logger.info(`   Upload URL: ${result.uploadResult.secureUrl}`);
        logger.info(`   Public ID: ${result.uploadResult.publicId}`);
        return result;
    } catch (error) {
        logger.error(' Pipeline test failed:', error.message);
        throw error;
    }
}

// test
if (require.main === module) {
    testPipeline().catch(() => process.exit(1));
}

module.exports = testPipeline;