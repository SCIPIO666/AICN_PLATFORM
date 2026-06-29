const nodemailer = require('nodemailer');
const logger = require('../utils/logger');
const dotenv = require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Store test account for preview URLs
if (process.env.SMTP_HOST === 'smtp.ethereal.email') {
  transporter.testAccount = {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  };
}

async function verifyMailer() {
  try {
    await transporter.verify();
    logger.info("SMTP connection verified");
    
    // Log Ethereal credentials if using it
    if (transporter.testAccount) {
      console.log('\n ETHEREAL EMAIL CONFIGURED:');
      console.log(`   Email: ${transporter.testAccount.user}`);
      console.log(`   Password: ${transporter.testAccount.pass?true: false}`);
      console.log(`   Login: https://ethereal.email/login`);
      console.log('   Check your emails at: https://ethereal.email/messages\n');
    }
  } catch (err) {
    logger.error({ err }, "SMTP connection failed — emails will not send");
  }
}

module.exports = { transporter, verifyMailer };