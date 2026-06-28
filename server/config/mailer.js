const nodemailer = require('nodemailer');
const logger     = require('../utils/logger');
const dotenv=require('dotenv').config()
 
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: Number(process.env.SMTP_PORT) === 465,  
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function verifyMailer(){
  try {
    await transporter.verify();
    logger.info("SMTP connection verified");
  } catch (err) {
    logger.error({ err }, "SMTP connection failed — emails will not send");
  }
};
 
module.exports = { transporter, verifyMailer };
