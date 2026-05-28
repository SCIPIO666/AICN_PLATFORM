const transporter = require('../../../config/emailTransporter');

const logger = require( '../../logger');

async function sendEmail({to,subject,html,attachments = []}) {

  try {

    const info =await transporter.sendMail({from: process.env.EMAIL_FROM,to,subject,html,attachments});

    logger.info(`Email sent to ${to}`);

    return info;

  //   {  info response object
  // // Unique message ID
  // messageId: '<abc123@mail.example.com>',
  
  // // Array of accepted recipients
  // accepted: ['recipient@example.com'],
  
  // // Array of rejected recipients
  // rejected: [],
  
  // // Array of pending recipients
  // pending: [],
  
  // // Response from the SMTP server
  // response: '250 2.0.0 Ok: queued as ABC123',
  
  // // Envelope information
  // envelope: {
  //   from: 'sender@example.com',
  //   to: ['recipient@example.com']
  // },

  } catch (error) {

    logger.error(
      `Email failed: ${error.message}`
    );

    throw error;
  }
}

module.exports = {
  sendEmail,
};