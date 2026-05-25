const nodemailer = require('nodemailer');
const logger = require('../utils/logger');

const createTransporter = () => {
  // development/testing with ethereal.email (fake SMTP)
  if (process.env.NODE_ENV === 'development' && !process.env.SMTP_USER) {
    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: process.env.ETHEREAL_USER || 'test@ethereal.com',
        pass: process.env.ETHEREAL_PASS || 'test123'
      }
    });
  }
  
  // Production  real SMTP
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    },
    tls: {
      rejectUnauthorized: process.env.NODE_ENV === 'production'
    }
  });
};

const transporter = createTransporter();

// connection test
const verifyConnection = async () => {
  try {
    await transporter.verify();
    logger.info(' Email service is ready');
  } catch (error) {
    logger.error(` Email service failed: ${error.message}`);
  }
};

//  email configuration test
const testEmailConfig = async () => {
  try {
    const info = await transporter.sendMail({
      from: `"Test" <${process.env.SMTP_FROM || 'test@aicn.com'}>`,
      to: 'test@example.com',
      subject: 'Test Email',
      text: 'Email configuration is working!'
    });
    logger.info(`Test email sent: ${info.messageId}`);
    return true;
  } catch (error) {
    logger.error(`Test email failed: ${error.message}`);
    return false;
  }
};

module.exports = {
  transporter,
  verifyConnection,
  testEmailConfig
};
