const fs = require('fs');
const { generateCertificatePDF } = require('../utils/pdf/pdfGenerator');

async function testPDF() {
  console.log('Testing PDF generation...');
  
  const testData = {
    certCode: 'TEST-PDF-001',
    userName: 'John Doe',
    sessionTitle: 'Advanced JavaScript Workshop',
    sessionDate: new Date(),
    skillArea: 'Programming',
    duration: 120,
    trainerName: 'Jane Smith',
    issueDate: new Date(),
    verifyUrl: 'http://localhost:3000/verify/TEST-PDF-001'
  };
  
  try {
    const pdfBuffer = await generateCertificatePDF(testData);
    
    // Save to file for inspection
    fs.writeFileSync('./test-certificate.pdf', pdfBuffer);
    console.log(`PDF generated successfully! Size: ${pdfBuffer.length} bytes`);
    console.log('Saved to: ./test-certificate.pdf');
  } catch (error) {
    console.error('PDF generation failed:', error.message);
  }
}

testPDF();
