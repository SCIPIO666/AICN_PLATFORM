// scripts/test-email.js
const { testEmailConnection, sendTestEmail } = require('../utils/email/email services/emailService');

async function main() {
  console.log('\n🔍 Testing email connection...\n');
  
  // Test connection
  const connected = await testEmailConnection();
  if (!connected) {
    console.error('\n❌ Email connection failed!');
    console.log('\n💡 If you\'re in development, Ethereal should work automatically.');
    console.log('   No configuration needed - Ethereal creates a test account on the fly.\n');
    process.exit(1);
  }

  console.log('\n📧 Sending test email...\n');
  
  try {
    // You can optionally provide a real email to test delivery
    // const result = await sendTestEmail('your-real-email@gmail.com');
    const result = await sendTestEmail();
    
    console.log('\n✅ Test complete!');
    console.log('   Check the terminal output above for the Ethereal preview URL.');
    console.log('   The email was sent to a fake inbox - you can view it in your browser.\n');
  } catch (error) {
    console.error('\n❌ Test email failed:', error.message);
    process.exit(1);
  }
}

main();