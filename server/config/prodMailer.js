const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async ({ to, subject, html, attachments = [] }) => {
  const resendAttachments = attachments.map(({ filename, content }) => ({
    filename,
    content,
  }));

  const { data, error } = await resend.emails.send({
    from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
    to,
    subject,
    html,
    attachments: resendAttachments.length > 0 ? resendAttachments : undefined,
  });

  if (error) throw new Error(error.message);
  return data;
};

module.exports = { sendEmail };