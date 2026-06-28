// config/emailTransporter.js
const nodemailer = require('nodemailer');
const logger = require('../utils/logger');
const dotenv=require('dotenv').config()

/**
 * Create email transporter with fallback to Ethereal
 */
async function createTransporter() {
  // Try to use Ethereal for development or as fallback
  const useEthereal = process.env.NODE_ENV === 'development' || 
                      !process.env.EMAIL_USER || 
                      !process.env.EMAIL_PASS;

  if (useEthereal) {
    try {
      // Create Ethereal test account
      const testAccount = await nodemailer.createTestAccount();
      
      logger.info(`📧 Ethereal email account created:`, {
        user: testAccount.user,
        pass: testAccount.pass,
        preview: `https://ethereal.email/login`
      });

      const transporter = nodemailer.createTransporter({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });

      // Store test account for preview URLs
      transporter.testAccount = testAccount;

      return transporter;
    } catch (error) {
      logger.error('Failed to create Ethereal account:', error.message);
      throw error;
    }
  }

  // Production - use configured SMTP
  logger.info('📧 Using configured SMTP server:', {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    user: process.env.EMAIL_USER ? 'Set' : 'Not set',
  });

  return nodemailer.createTransporter({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: parseInt(process.env.EMAIL_PORT) === 465,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
}

// Singleton instance
let transporterInstance = null;

/**
 * Get or create transporter
 */
async function getTransporter() {
  if (!transporterInstance) {
    transporterInstance = await createTransporter();
  }
  return transporterInstance;
}

/**
 * Get Ethereal preview URL
 */
function getEtherealPreviewUrl(info) {
  if (transporterInstance && transporterInstance.testAccount) {
    return nodemailer.getTestMessageUrl(info);
  }
  return null;
}

/**
 * Reset transporter (useful for testing)
 */
function resetTransporter() {
  transporterInstance = null;
}

module.exports = {
  createTransporter,
  getTransporter,
  getEtherealPreviewUrl,
  resetTransporter,
};