const logger=require('../../../utils/logger')
const nodemailer = require('nodemailer');
const { getTransporter } = require('../../../config/mailer');
const dotenv=require('dotenv').config()

async function sendEmail({ to, subject, html, text }) {
  const transporter = getTransporter();

  if (!transporter) {
    throw new Error('Mailer transporter not initialized yet');
  }

  const mailOptions = {
    from:  process.env.EMAIL_USER, //or alternative process.env.EMAIL_FROM 
    to,
    subject,
    text, // plain text fallback (accessibility + spam score)
    html, // rich HTML version
  };

  const info = await transporter.sendMail(mailOptions);

  // In dev mode
  if (process.env.NODE_ENV !== 'production') {
    logger.info('[Mailer] Preview URL:', nodemailer.getTestMessageUrl(info));
  }

  return info;
}

// --- Pre-built email templates ---

async function sendWelcomeEmail(user) {
  return sendEmail({
    to: user.email,
    subject: 'Welcome aboard!',
    text: `Hi ${user.name}, welcome to the platform.`,
    html: `<h1>Hi ${user.name}</h1><p>Welcome to the platform. Glad to have you.</p>`,
  });
}

async function sendPasswordResetEmail(user, resetLink) {
  return sendEmail({
    to: user.email,
    subject: 'Reset your password',
    text: `Reset your password: ${resetLink}`,
    html: `
      <h2>Password reset</h2>
      <p>Click the link below. It expires in 1 hour.</p>
      <a href="${resetLink}" style="padding:10px 20px;background:#0f6e56;color:#fff;border-radius:6px;text-decoration:none;">
        Reset password
      </a>
      <p style="color:#888;font-size:12px;">If you didn't request this, ignore this email.</p>
    `,
  });
}

module.exports = { sendEmail, sendWelcomeEmail, sendPasswordResetEmail };