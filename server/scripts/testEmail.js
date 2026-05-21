const { transporter, testEmailConfig } = require('../config/email');
const { sendWelcomeEmail, sendCertificateEmail } = require('../utils/email/emailService');

async function testEmail() {
  console.log('Testing email configuration...');
  
  const isWorking = await testEmailConfig();
  if (!isWorking) {
    console.error('Email configuration failed. Check your .env settings.');
    return;
  }
  
  console.log('Testing welcome email...');
  await sendWelcomeEmail('test@example.com', 'Test User');
  
  console.log('Testing certificate email...');
  const mockPdfBuffer = Buffer.from('Test PDF content');
  await sendCertificateEmail(
    'test@example.com',
    'Test User',
    'Test Course',
    'TEST-123',
    mockPdfBuffer,
    { skillArea: 'Test', durationMins: 60 }
  );
  
  console.log('All email tests completed!');
}

testEmail().catch(console.error);