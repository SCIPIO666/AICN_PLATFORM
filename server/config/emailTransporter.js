const nodemailer = require('nodemailer');
const logger = require('../utils/logger');
const dotenv=require('dotenv').config()

const transporter = nodemailer.createTransport({

  host: process.env.EMAIL_HOST,

  port: process.env.EMAIL_PORT,

  secure: false,

  auth: {
    user: process.env.EMAIL_USER,

    pass: process.env.EMAIL_PASS,
  },
});

module.exports = transporter;