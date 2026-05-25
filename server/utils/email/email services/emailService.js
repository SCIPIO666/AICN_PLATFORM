const transporter = require(
  '../../../config/emailTransporter'
);

const logger = require(
  '../../logger'
);

async function sendEmail({

  to,

  subject,

  html,

  attachments = [],

}) {

  try {

    const info =
      await transporter.sendMail({

        from: process.env.EMAIL_FROM,

        to,

        subject,

        html,

        attachments,
      });

    logger.info(
      `Email sent to ${to}`
    );

    return info;

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