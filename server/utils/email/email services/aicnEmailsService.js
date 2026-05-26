const {sendEmail} = require('./emailService');

const certificateEmailTemplate =require('../templates/certificateEmail.template');

async function sendCertificateEmail({ to,name,sessionTitle,certCode,pdfBuffer}) {

  const html =
    certificateEmailTemplate({name,sessionTitle,certCode,});

  return await sendEmail({to,subject:'Your AICN Certificate',html,attachments: [
      {
        filename: `${certCode}.pdf`,

        content: pdfBuffer,

        contentType:
          'application/pdf',
      },
    ],
  });
}
  async function sendEnrolmentConfirmationEmail(){

  }
  async function sendTrainerApprovalEmail(){

  }
  async function sendWelcomeEmail(){

  }
  async function sendPasswordResetEmail(){

  }
module.exports ={
  sendCertificateEmail,
  sendEnrolmentConfirmationEmail,
  sendTrainerApprovalEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail

}
