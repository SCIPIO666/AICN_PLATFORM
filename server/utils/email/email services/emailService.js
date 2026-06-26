
const { getTransporter, getEtherealPreviewUrl } = require('../../../config/emailTransporter');
const logger = require('../../../utils/logger');

/**
 * Send email with proper error handling
 */
async function sendEmail({ to, subject, html, attachments = [] }) {
  // Validate
  if (!to) throw new Error('Recipient email (to) is required');
  if (!subject) throw new Error('Email subject is required');
  if (!html) throw new Error('Email HTML content is required');

  try {
    const transporter = await getTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'AICN Training <noreply@aicn.africa>',
      to,
      subject,
      html,
      attachments,
      messageId: `<${Date.now()}.${Math.random().toString(36).substring(2, 15)}@aicn.africa>`,
    };

    if (process.env.DEBUG_EMAIL === 'true') {
      logger.info('📧 Sending email:', { to, subject, hasAttachments: attachments.length > 0 });
    }

    const info = await transporter.sendMail(mailOptions);

    logger.info(`✅ Email sent to ${to}`, {
      messageId: info.messageId,
      accepted: info.accepted,
    });

    // Ethereal preview URL
    if (process.env.NODE_ENV === 'development' || !process.env.EMAIL_USER) {
      const previewUrl = getEtherealPreviewUrl(info);
      if (previewUrl) {
        logger.info(`📧 Preview: ${previewUrl}`);
        // Also log to console for easy access
        console.log(`\n🔗 EMAIL PREVIEW: ${previewUrl}\n`);
      }
    }

    return info;
  } catch (error) {
    logger.error(`❌ Email failed for ${to}:`, {
      error: error.message,
      code: error.code,
    });
    throw error;
  }
}

/**
 * Test email connection
 */
async function testEmailConnection() {
  try {
    const transporter = await getTransporter();
    await transporter.verify();
    logger.info('✅ Email connection verified successfully');
    
    // Log Ethereal credentials if using it
    if (transporter.testAccount) {
      logger.info('📧 Ethereal credentials:', {
        user: transporter.testAccount.user,
        pass: transporter.testAccount.pass,
        login: 'https://ethereal.email/login',
      });
      console.log('\n📧 ETHEREAL EMAIL SETUP:');
      console.log(`   Email: ${transporter.testAccount.user}`);
      console.log(`   Password: ${transporter.testAccount.pass}`);
      console.log(`   Login: https://ethereal.email/login\n`);
    }
    
    return true;
  } catch (error) {
    logger.error('❌ Email connection test failed:', error.message);
    return false;
  }
}

/**
 * Send a test email
 */
async function sendTestEmail(to = null) {
  const recipient = to || 'test@example.com';
  
  const result = await sendEmail({
    to: recipient,
    subject: '✅ AICN Email Test',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #166534; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #ffffff; padding: 20px; border: 1px solid #e5e7eb; border-radius: 0 0 10px 10px; }
          .success { color: #166534; font-weight: bold; }
          .footer { text-align: center; padding: 20px; font-size: 12px; color: #6b7280; }
        </style>
      </head>
      <body>
        <div class="header">
          <h2>✅ Email Test Successful</h2>
        </div>
        <div class="content">
          <p class="success">Your AICN email system is working correctly!</p>
          <p>This is a test email from the AICN Training Platform.</p>
          <p>Sent at: ${new Date().toLocaleString()}</p>
          <hr>
          <p style="color: #6b7280; font-size: 14px;">
            If you received this, your email configuration is correct.
          </p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} AICN Training. All rights reserved.</p>
        </div>
      </body>
      </html>
    `,
  });

  console.log(`\n✅ Test email sent to: ${recipient}`);
  return result;
}

module.exports = {
  sendEmail,
  testEmailConnection,
  sendTestEmail,
};