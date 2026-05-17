
const nodemailer = require('nodemailer');
const logger=require('../utils/logger')
let transporter;

if (process.env.NODE_ENV === 'production') {
  // Real SMTP — reads from .env
  transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: process.env.EMAIL_SECURE === 'true', // true = port 465, false = 587
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
} else {
  // Development — Ethereal fake SMTP
  nodemailer.createTestAccount().then((testAccount) => {
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    clogger.info('[Mailer] Ethereal test account:', testAccount.user);
  });
}

module.exports = { getTransporter: () => transporter };
