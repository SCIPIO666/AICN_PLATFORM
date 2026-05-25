const {
  sendEmail,
} = require('./emailService');

const certificateEmailTemplate =
  require(
    '../templates/certificateEmail.template'
  );

async function sendPasswordResetEmail({

  to,

  name,

  sessionTitle,

  certCode,

  pdfBuffer,

}) {

  const html =
    certificateEmailTemplate({

      name,

      sessionTitle,

      certCode,
    });

  return await sendEmail({

    to,

    subject:
      'Your AICN Certificate',

    html,

    attachments: [
      {
        filename: `${certCode}.pdf`,

        content: pdfBuffer,

        contentType:
          'application/pdf',
      },
    ],
  });
}

module.exports=sendPasswordResetEmail
