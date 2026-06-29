const nodemailer = require('nodemailer');
const logger = require('../utils/logger');
const dotenv = require('dotenv').config();

/**
 * transporter based on environment
 * - Production: Uses Gmail SMTP (real emails)
 * - Development: Uses Ethereal SMTP (test emails)
 */
function createTransporter() {
  const isProduction = process.env.NODE_ENV === 'production';
  
  let config;
  
  if (isProduction) {
    // PRODUCTION
    logger.info('Configuring PRODUCTION email transporter (Gmail)');
    
    config = {
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: Number(process.env.EMAIL_PORT) || 587,
      secure: Number(process.env.EMAIL_PORT) === 465,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    };
    
    // Validate production credentials
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      logger.warn(' Production email credentials missing! Check EMAIL_USER and EMAIL_PASS in .env');
    }
  } else {
    // DEVELOPMENT
    logger.info('Configuring DEVELOPMENT email transporter (Ethereal)');
    
    config = {
      host: process.env.SMTP_HOST || 'smtp.ethereal.email',
      port: Number(process.env.SMTP_PORT) || 587,
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    };
    
    // Validate development credentials
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      logger.warn(' Development email credentials missing! Check SMTP_USER and SMTP_PASS in .env');
    }
  }
  
  // transporter 
  const transporter = nodemailer.createTransport({
    ...config,
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000,
    tls: {
      rejectUnauthorized: isProduction ? true : false, // Less strict in dev
    },
  });
  
  //metadata 
  transporter.metadata = {
    environment: isProduction ? 'production' : 'development',
    provider: isProduction ? 'gmail' : 'ethereal',
    user: isProduction ? process.env.EMAIL_USER : process.env.SMTP_USER,
  };
  
  // test account info for Ethereal preview URLs
  if (!isProduction) {
    transporter.testAccount = {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    };
  }
  
  return transporter;
}

// Initialize transporter
const transporter = createTransporter();


//email connection
async function verifyMailer() {
  try {
    await transporter.verify();
    
    const env = transporter.metadata.environment;
    const provider = transporter.metadata.provider;
    const user = transporter.metadata.user;
    
    logger.info(`SMTP connection verified (${env} - ${provider})`);
    
   
    if (env === 'production') {
      logger.info('\n PRODUCTION EMAIL CONFIGURED:');
      logger.info(`   Provider: Gmail`);
      logger.info(`   Email: ${user}`);
      logger.info(`     Check your Gmail "Sent" folder for sent emails`);
      logger.info(`     Daily limit: 500 emails\n`);
    } else {
      // Development - Ethereal
      logger.info('\nDEVELOPMENT EMAIL CONFIGURED:');
      logger.info(`   Provider: Ethereal`);
      logger.info(`   Email: ${user}`);
      logger.info(`   Login: https://ethereal.email/login`);
      logger.info(`   View messages: https://ethereal.email/messages`);
      logger.info(`    Emails are virtual - check the preview URL in logs\n`);
    }
  } catch (err) {
    logger.error({ err }, ` SMTP connection failed (${transporter.metadata.environment})`);
    
    //  error messages
    if (transporter.metadata.environment === 'production') {
      logger.error(' For Gmail, make sure:');
      logger.error('   1. EMAIL_USER is correct');
      logger.error('   2. EMAIL_PASS is an App Password (not your regular password)');
      logger.error('   3. 2FA is enabled on your Google account');
      logger.error('   4. App Password was generated for "Mail"');
    } else {
      logger.error(' For Ethereal, make sure:');
      logger.error('   1. SMTP_USER and SMTP_PASS are correct');
      logger.error('   2. Or create a new account at https://ethereal.email');
    }
  }
}

// "from" address based on environment

function getFromAddress() {
  if (process.env.NODE_ENV === 'production') {
    return process.env.EMAIL_FROM || `AICN Training <${process.env.EMAIL_USER}>`;
  } else {
    return process.env.EMAIL_FROM || 'AICN Training <noreply@aicn.africa>';
  }
}

// Get preview URL for Ethereal emails

function getEtherealPreviewUrl(info) {
  if (transporter.metadata.provider === 'ethereal' && info.messageId) {
    return `https://ethereal.email/message/${info.messageId}`;
  }
  return null;
}

module.exports = { 
  transporter, 
  verifyMailer, 
  getFromAddress,
  getEtherealPreviewUrl,
  isProduction: process.env.NODE_ENV === 'production'
};