const { sendEmail } = require('./emailService');
require('../hbsLoader');

// templates
const certificateEmailTemplate        = require('../emailTemplates/certificate.hbs');
const enrolmentConfirmationTemplate   = require('../emailTemplates/enrolmentConfirmation.hbs');
const trainerApprovalTemplate         = require('../emailTemplates/trainerApproval.hbs');
const trainerApplicationReceivedTemplate = require('../emailTemplates/trainerApplicationReceived.hbs');
const welcomeEmailTemplate            = require('../emailTemplates/welcome.hbs');
const passwordResetTemplate           = require('../emailTemplates/passwordReset.hbs');

// ── Certificate ───────────────────────────────────────────────────────────────
async function sendCertificateEmail({ to, name, sessionTitle, certCode, pdfBuffer, meta = {} }) {
  const html = certificateEmailTemplate({
    name, sessionTitle, certCode,
    skillArea: meta.skillArea,
    duration: meta.durationMins,
    verifyUrl: `${process.env.FRONTEND_URL}/verify/${certCode}`,
    year: new Date().getFullYear()
  });

  return await sendEmail({
    to,
    subject: `Your AICN Certificate: ${sessionTitle}`,
    html,
    attachments: [{
      filename: `certificate-${certCode}.pdf`,
      content: pdfBuffer,
      contentType: 'application/pdf',
    }],
  });
}

// ── Enrolment confirmation ────────────────────────────────────────────────────
async function sendEnrolmentConfirmationEmail({ to, name, sessionTitle, sessionDate, sessionTime, location, duration, sessionId, trainerName }) {
  const formattedDate = new Date(sessionDate).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  const html = enrolmentConfirmationTemplate({
    name, sessionTitle,
    sessionDate: formattedDate,
    sessionTime,
    location: location || 'Virtual (Zoom/Google Meet)',
    duration, sessionId,
    trainerName: trainerName || 'AICN Training Faculty',
    frontendUrl: process.env.FRONTEND_URL
  });

  return await sendEmail({ to, subject: `Enrolment Confirmed: ${sessionTitle}`, html });
}

// Trainer approval / rejection 
async function sendTrainerApprovalEmail({ to, name, approved, reason = null, trainerId = null }) {
  const html = trainerApprovalTemplate({
    name, approved, reason, trainerId,
    frontendUrl: process.env.FRONTEND_URL,
    supportEmail: process.env.SUPPORT_EMAIL || 'support@aicn.africa'
  });

  const subject = approved
    ? `Trainer Application Approved - Welcome to AICN!`
    : `Trainer Application Update - AICN`;

  return await sendEmail({ to, subject, html });
}

// Trainer application received (NEW) 
async function sendTrainerApplicationReceivedEmail({ to, name }) {
  const html = trainerApplicationReceivedTemplate({
    name,
    frontendUrl: process.env.FRONTEND_URL,
    supportEmail: process.env.SUPPORT_EMAIL || 'support@aicn.africa',
    year: new Date().getFullYear()  // Add this line
  });

  return await sendEmail({
    to,
    subject: `We received your AICN Trainer Application`,
    html
  });
}

//  Welcome 
async function sendWelcomeEmail({ to, name, role = 'USER', tempPassword = null }) {
  const html = welcomeEmailTemplate({
    name, role, tempPassword,
    frontendUrl: process.env.FRONTEND_URL,
    supportEmail: process.env.SUPPORT_EMAIL || 'support@aicn.africa',
    year: new Date().getFullYear()
  });

  const subject = tempPassword
    ? `Welcome to AICN! Complete Your Registration`
    : `Welcome to AICN Training Platform, ${name}!`;

  return await sendEmail({ to, subject, html });
}

// Password reset 
async function sendPasswordResetEmail({ to, name, resetToken, expiryHours = 1 }) {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

  const html = passwordResetTemplate({
    name, resetUrl, expiryHours,
    frontendUrl: process.env.FRONTEND_URL,
    supportEmail: process.env.SUPPORT_EMAIL || 'support@aicn.africa',
    year: new Date().getFullYear()
  });

  return await sendEmail({ to, subject: `Reset Your AICN Password`, html });
}

// Session reminder (inline HTML, no template file) 
async function sendSessionReminderEmail({ to, name, sessionTitle, sessionDate, sessionTime, meetingLink }) {
  const formattedDate = new Date(sessionDate).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  const html = `
    <!DOCTYPE html><html><head><meta charset="UTF-8">
    <style>
      body{font-family:Arial,sans-serif;line-height:1.6;max-width:600px;margin:0 auto;padding:20px;background:#faf7f2}
      .header{background:linear-gradient(135deg,#d97706 0%,#b45309 100%);color:white;padding:30px;text-align:center;border-radius:10px 10px 0 0}
      .content{background:#fff;padding:30px;border-radius:0 0 10px 10px;border:1px solid #e7e2d8}
      .session-card{background:#f1ece3;padding:20px;border-radius:10px;margin:20px 0;border-left:4px solid #d97706}
      .button{display:inline-block;background:#d97706;color:white;padding:12px 24px;text-decoration:none;border-radius:5px;margin:20px 0;font-weight:bold}
      .footer{text-align:center;padding:20px;font-size:12px;color:#57534e}
    </style></head><body>
    <div class="header"><h2>Session Reminder</h2></div>
    <div class="content">
      <p>Dear <strong>${name}</strong>,</p>
      <p>Your training session starts soon!</p>
      <div class="session-card">
        <h3 style="color:#d97706;margin-top:0">${sessionTitle}</h3>
        <p><strong>Date:</strong> ${formattedDate}</p>
        <p><strong>Time:</strong> ${sessionTime}</p>
        ${meetingLink ? `<p><strong>Link:</strong> <a href="${meetingLink}" style="color:#d97706">Join Session</a></p>` : ''}
      </div>
      <div style="text-align:center">
        <a href="${meetingLink || `${process.env.FRONTEND_URL}/sessions`}" class="button">
          ${meetingLink ? 'Join Session Now' : 'View Session Details'}
        </a>
      </div>
      <p>Need help? <a href="mailto:${process.env.SUPPORT_EMAIL || 'support@aicn.africa'}" style="color:#d97706">${process.env.SUPPORT_EMAIL || 'support@aicn.africa'}</a></p>
    </div>
    <div class="footer"><p>&copy; ${new Date().getFullYear()} AICN Training. All rights reserved.</p></div>
    </body></html>
  `;

  return await sendEmail({ to, subject: `Reminder: ${sessionTitle} starts soon!`, html });
}

async function sendEnrolmentCancellationEmail({ to, name, sessionTitle, reason = null }) {
  const html = `
    <!DOCTYPE html><html><head><meta charset="UTF-8"></head><body style="font-family:Arial,sans-serif;line-height:1.6;color:#1c1917">
      <p>Dear <strong>${name}</strong>,</p>
      <p>Your enrolment for <strong>${sessionTitle}</strong> has been cancelled.</p>
      ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ''}
      <p>You can browse available sessions from your dashboard whenever you are ready to enrol again.</p>
      <p style="font-size:13px;color:#57534e">AICN Training Platform</p>
    </body></html>
  `;

  return await sendEmail({ to, subject: `Enrolment Cancelled: ${sessionTitle}`, html });
}

async function sendSessionCancellationEmail({ to, name, sessionTitle, sessionDate, reason = null }) {
  const formattedDate = sessionDate
    ? new Date(sessionDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : 'the scheduled date';

  const html = `
    <!DOCTYPE html><html><head><meta charset="UTF-8"></head><body style="font-family:Arial,sans-serif;line-height:1.6;color:#1c1917">
      <p>Dear <strong>${name}</strong>,</p>
      <p>The session <strong>${sessionTitle}</strong>, scheduled for <strong>${formattedDate}</strong>, has been cancelled.</p>
      ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ''}
      <p>Please check your dashboard for other available sessions.</p>
      <p style="font-size:13px;color:#57534e">AICN Training Platform</p>
    </body></html>
  `;

  return await sendEmail({ to, subject: `Session Cancelled: ${sessionTitle}`, html });
}

module.exports = {
  sendCertificateEmail,
  sendEnrolmentConfirmationEmail,
  sendEnrolmentCancellationEmail,
  sendSessionCancellationEmail,
  sendTrainerApprovalEmail,
  sendTrainerApplicationReceivedEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendSessionReminderEmail,
};