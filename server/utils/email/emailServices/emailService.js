const logger = require('../../logger');
require('../hbsLoader');
const dotenv=require('dotenv').config()
const isProduction = process.env.NODE_ENV === 'production';

async function sendEmail({ to, subject, html, attachments = [] }) {
  if (!to)      throw new Error('Recipient email (to) is required');
  if (!subject) throw new Error('Email subject is required');
  if (!html)    throw new Error('Email HTML content is required');

  if (isProduction) {
    // ── Resend (production) ───────────────────────────────────────────────────
    const { sendEmail: resendSend } = require('../../../config/prodMailer');
    try {
      const data = await resendSend({ to, subject, html, attachments });
      logger.info(` Email sent to ${to}`, { provider: 'Resend', id: data?.id });
      return data;
    } catch (error) {
      logger.error(` Email failed for ${to} (Resend): ${error.message}`);
      throw error;
    }
  } else {
    // ── Ethereal (development) ────────────────────────────────────────────────
    const { transporter, getFromAddress, getEtherealPreviewUrl } = require('../../../config/mailer');
    try {
      const info = await transporter.sendMail({
        from: getFromAddress(),
        to,
        subject,
        html,
        attachments,
        messageId: `<${Date.now()}.${Math.random().toString(36).substring(2, 15)}@aicn.africa>`,
      });

      logger.info(` Email sent to ${to}`, { provider: 'Ethereal', messageId: info.messageId });

      const previewUrl = getEtherealPreviewUrl(info);
      if (previewUrl) {
        logger.info(`\n EMAIL PREVIEW URL: ${previewUrl}`);
        logger.info(` View all messages: https://ethereal.email/messages\n`);
      }

      return info;
    } catch (error) {
      logger.error(` Email failed for ${to} (Ethereal): ${error.message}`);
      throw error;
    }
  }
}

async function testEmailConnection() {
  if (isProduction) {
    if (!process.env.RESEND_API_KEY) {
      logger.error(' RESEND_API_KEY not set — emails will fail in production');
      return false;
    }
    logger.info('\n PRODUCTION EMAIL READY:');
    logger.info('   Provider : Resend');
    logger.info(`   From     : ${process.env.EMAIL_FROM || 'onboarding@resend.dev'}`);
    logger.info('   Limit    : 3,000 emails/month free\n');
    return true;
  } else {
    const { transporter } = require('../../../config/mailer');
    try {
      await transporter.verify();
      logger.info('\n DEVELOPMENT EMAIL READY:');
      logger.info('   Provider : Ethereal');
      logger.info('   View     : https://ethereal.email/messages\n');
      return true;
    } catch (error) {
      logger.error(` Ethereal connection failed: ${error.message}`);
      return false;
    }
  }
}

async function sendTestEmail(to = null) {
  const recipient = to || process.env.TEST_EMAIL_RECIPIENT || 'test@example.com';

  await sendEmail({
    to: recipient,
    subject: `AICN Email Test (${isProduction ? 'Production · Resend' : 'Development · Ethereal'})`,
    html: `
      <!DOCTYPE html><html><head>
      <style>
        body{font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px}
        .header{background:#166534;color:white;padding:20px;text-align:center;border-radius:10px 10px 0 0}
        .content{background:#fff;padding:20px;border:1px solid #e5e7eb;border-radius:0 0 10px 10px}
        .badge{display:inline-block;padding:4px 12px;border-radius:20px;font-size:12px;font-weight:bold;
          background:${isProduction ? '#dc2626' : '#2563eb'};color:white}
        .footer{text-align:center;padding:20px;font-size:12px;color:#6b7280}
      </style></head><body>
      <div class="header">
        <h2>Email Test Successful</h2>
        <span class="badge">${isProduction ? 'Production · Resend' : 'Development · Ethereal'}</span>
      </div>
      <div class="content">
        <p style="color:#166534;font-weight:bold">Your AICN email system is working!</p>
        <p><strong>Environment:</strong> ${process.env.NODE_ENV || 'development'}</p>
        <p><strong>Provider:</strong> ${isProduction ? 'Resend' : 'Ethereal'}</p>
        <p><strong>Sent at:</strong> ${new Date().toLocaleString()}</p>
      </div>
      <div class="footer"><p>© ${new Date().getFullYear()} AICN Training. All rights reserved.</p></div>
      </body></html>
    `,
  });

  logger.info(` Test email sent to: ${recipient}`);
}

module.exports = { sendEmail, testEmailConnection, sendTestEmail };