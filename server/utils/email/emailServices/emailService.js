const logger = require('../../logger');
const { transporter, getFromAddress, getEtherealPreviewUrl } = require('../../../config/mailer');
const dotenv=require('dotenv').config()
require('../hbsLoader');

async function sendEmail({ to, subject, html, attachments = [] }) {
  if (!to)      throw new Error('Recipient email (to) is required');
  if (!subject) throw new Error('Email subject is required');
  if (!html)    throw new Error('Email HTML content is required');

  try {
    const info = await transporter.sendMail({
      from: getFromAddress(),
      to,
      subject,
      html,
      attachments,
      messageId: `<${Date.now()}.${Math.random().toString(36).substring(2, 15)}@aicn.africa>`,
    });

    logger.info(` Email sent to ${to}`, {
      messageId: info.messageId,
      accepted: info.accepted,
      environment: process.env.NODE_ENV || 'development',
    });

    const previewUrl = getEtherealPreviewUrl(info);
    if (previewUrl) {
      logger.info(`\n EMAIL PREVIEW URL: ${previewUrl}`);
      logger.info(` View all messages: https://ethereal.email/messages\n`);
    }

    return info;
  } catch (error) {
    logger.error(` Email failed for ${to}:`, {
      error: error.message,
      code: error.code,
      environment: process.env.NODE_ENV || 'development',
    });
    throw error;
  }
}

async function testEmailConnection() {
  try {
    await transporter.verify();
    logger.info(' Email connection verified successfully');

    if (process.env.NODE_ENV === 'production') {
      logger.info('\n PRODUCTION EMAIL READY:');
      logger.info(`   Using: Gmail (${process.env.EMAIL_USER})`);
      logger.info('   Port: 465 (SSL)');
      logger.info('   Daily limit: 500 emails\n');
    } else {
      logger.info('\n DEVELOPMENT EMAIL READY:');
      logger.info(`   Using: Ethereal (${process.env.SMTP_USER})`);
      logger.info('   View: https://ethereal.email/messages\n');
    }

    return true;
  } catch (error) {
    logger.error(' Email connection test failed:', error.message);
    return false;
  }
}

async function sendTestEmail(to = null) {
  const recipient = to || process.env.TEST_EMAIL_RECIPIENT || 'test@example.com';

  const result = await sendEmail({
    to: recipient,
    subject: `AICN Email Test (${process.env.NODE_ENV || 'development'})`,
    html: `
      <!DOCTYPE html><html><head>
      <style>
        body{font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px}
        .header{background:#166534;color:white;padding:20px;text-align:center;border-radius:10px 10px 0 0}
        .content{background:#fff;padding:20px;border:1px solid #e5e7eb;border-radius:0 0 10px 10px}
        .badge{display:inline-block;padding:4px 12px;border-radius:20px;font-size:12px;font-weight:bold;
          background:${process.env.NODE_ENV === 'production' ? '#dc2626' : '#2563eb'};color:white}
        .footer{text-align:center;padding:20px;font-size:12px;color:#6b7280}
      </style></head><body>
      <div class="header">
        <h2>Email Test Successful</h2>
        <span class="badge">${process.env.NODE_ENV === 'production' ? 'Production · Gmail' : 'Development · Ethereal'}</span>
      </div>
      <div class="content">
        <p style="color:#166534;font-weight:bold">Your AICN email system is working!</p>
        <p><strong>Environment:</strong> ${process.env.NODE_ENV || 'development'}</p>
        <p><strong>Provider:</strong> ${process.env.NODE_ENV === 'production' ? 'Gmail (port 465 SSL)' : 'Ethereal'}</p>
        <p><strong>Sent at:</strong> ${new Date().toLocaleString()}</p>
      </div>
      <div class="footer"><p>© ${new Date().getFullYear()} AICN Training. All rights reserved.</p></div>
      </body></html>
    `,
  });

  logger.info(` Test email sent to: ${recipient}`);
  return result;
}

module.exports = { sendEmail, testEmailConnection, sendTestEmail };