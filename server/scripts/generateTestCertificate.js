const { generateTestCertificate } = require('../utils/pdf/service/pdfGenerator');

async function main() {
    console.log('🎨 Generating premium test certificate...');
    
    try {
        const outputPath = await generateTestCertificate('./premium-certificate.pdf');
        console.log(`✅ Certificate generated successfully: ${outputPath}`);
        console.log('📂 Open the PDF file to view the premium design');
    } catch (error) {
        console.error('❌ Failed to generate certificate:', error.message);
    }
}

main();