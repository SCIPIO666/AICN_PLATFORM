const {sendEmail} = require('./emailService');

//all templates
const certificateEmailTemplate = require('../emailTemplates/certificate.hbs');
const enrolmentConfirmationTemplate =require('../emailTemplates/enrolmentConfirmation.hbs')
const trainerApprovalTemplate = require('../emailTemplates/trainerApproval.hbs')
const welcomeEmailTemplate = require('../emailTemplates/welcome.hbs')
const passwordResetTemplate =require('../emailTemplates/passwordReset.hbs')

/**
 * Send certificate email with PDF attachment
 * @param {Object} params - Email parameters
 * @param {string} params.to - Recipient email
 * @param {string} params.name - Recipient name
 * @param {string} params.sessionTitle - Session/course title
 * @param {string} params.certCode - Certificate code
 * @param {Buffer} params.pdfBuffer - PDF certificate buffer
 * @param {Object} params.meta - Additional metadata (skillArea, duration, etc.)
 */
async function sendCertificateEmail({ to, name, sessionTitle, certCode, pdfBuffer, meta = {} }) {
  const html = certificateEmailTemplate({
    name,
    sessionTitle,
    certCode,
    skillArea: meta.skillArea,
    duration: meta.durationMins,
    verifyUrl: `${process.env.FRONTEND_URL}/verify/${certCode}`,
    year: new Date().getFullYear()
  });

  return await sendEmail({
    to,
    subject: `🎓 Your AICN Certificate: ${sessionTitle}`,
    html,
    attachments: [
      {
        filename: `certificate-${certCode}.pdf`,
        content: pdfBuffer,
        contentType: 'application/pdf',
      },
    ],
  });
}

/**
 * Send enrolment confirmation email
 * @param {Object} params - Email parameters
 * @param {string} params.to - Recipient email
 * @param {string} params.name - Recipient name
 * @param {string} params.sessionTitle - Session title
 * @param {string|Date} params.sessionDate - Session date
 * @param {string} params.sessionTime - Session time
 * @param {string} params.location - Session location/venue
 * @param {number} params.duration - Duration in minutes
 * @param {string|number} params.sessionId - Session ID
 * @param {string} params.trainerName - Trainer name
 */
async function sendEnrolmentConfirmationEmail({ 
  to, 
  name, 
  sessionTitle, 
  sessionDate, 
  sessionTime, 
  location, 
  duration, 
  sessionId,
  trainerName 
}) {
  const formattedDate = new Date(sessionDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const html = enrolmentConfirmationTemplate({
    name,
    sessionTitle,
    sessionDate: formattedDate,
    sessionTime,
    location: location || 'Virtual (Zoom/Google Meet)',
    duration,
    sessionId,
    trainerName: trainerName || 'AICN Training Faculty',
    frontendUrl: process.env.FRONTEND_URL
  });

  return await sendEmail({
    to,
    subject: `✅ Enrolment Confirmed: ${sessionTitle}`,
    html,
  });
}

/**
 * Send trainer approval email
 * @param {Object} params - Email parameters
 * @param {string} params.to - Recipient email
 * @param {string} params.name - Recipient name
 * @param {boolean} params.approved - Whether application is approved
 * @param {string} params.reason - Rejection reason (if applicable)
 * @param {string} params.trainerId - Trainer ID (if approved)
 */
async function sendTrainerApprovalEmail({ 
  to, 
  name, 
  approved, 
  reason = null, 
  trainerId = null 
}) {
  const html = trainerApprovalTemplate({
    name,
    approved,
    reason,
    trainerId,
    frontendUrl: process.env.FRONTEND_URL,
    supportEmail: process.env.SUPPORT_EMAIL || 'support@aicn.africa'
  });

  const subject = approved 
    ? `🎉 Trainer Application Approved - Welcome to AICN!` 
    : `📝 Trainer Application Update - AICN`;

  return await sendEmail({
    to,
    subject,
    html,
  });
}

/**
 * Send welcome email to new user
 * @param {Object} params - Email parameters
 * @param {string} params.to - Recipient email
 * @param {string} params.name - Recipient name
 * @param {string} params.role - User role (USER, TRAINER, ADMIN)
 * @param {string} params.tempPassword - Temporary password (if applicable)
 */
async function sendWelcomeEmail({ 
  to, 
  name, 
  role = 'USER', 
  tempPassword = null 
}) {
  const html = welcomeEmailTemplate({
    name,
    role,
    tempPassword,
    frontendUrl: process.env.FRONTEND_URL,
    supportEmail: process.env.SUPPORT_EMAIL || 'support@aicn.africa',
    year: new Date().getFullYear()
  });

  const subject = tempPassword 
    ? `🎉 Welcome to AICN! Complete Your Registration` 
    : `🎉 Welcome to AICN Training Platform, ${name}!`;

  return await sendEmail({
    to,
    subject,
    html,
  });
}

/**
 * Send password reset email
 * @param {Object} params - Email parameters
 * @param {string} params.to - Recipient email
 * @param {string} params.name - Recipient name
 * @param {string} params.resetToken - Password reset token
 * @param {number} params.expiryHours - Token expiry in hours
 */
async function sendPasswordResetEmail({ 
  to, 
  name, 
  resetToken, 
  expiryHours = 1 
}) {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
  
  const html = passwordResetTemplate({
    name,
    resetUrl,
    expiryHours,
    frontendUrl: process.env.FRONTEND_URL,
    supportEmail: process.env.SUPPORT_EMAIL || 'support@aicn.africa',
    year: new Date().getFullYear()
  });

  return await sendEmail({
    to,
    subject: `🔐 Reset Your AICN Password`,
    html,
  });
}

/**
 * Send session reminder email
 * @param {Object} params - Email parameters
 * @param {string} params.to - Recipient email
 * @param {string} params.name - Recipient name
 * @param {string} params.sessionTitle - Session title
 * @param {string|Date} params.sessionDate - Session date
 * @param {string} params.sessionTime - Session time
 * @param {string} params.meetingLink - Virtual meeting link
 */
async function sendSessionReminderEmail({ 
  to, 
  name, 
  sessionTitle, 
  sessionDate, 
  sessionTime, 
  meetingLink 
}) {
  const formattedDate = new Date(sessionDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body {
          font-family: 'Arial', sans-serif;
          line-height: 1.6;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background: var(--bg-app, #faf7f2);
        }
        .header {
          background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
          color: white;
          padding: 30px;
          text-align: center;
          border-radius: 10px 10px 0 0;
        }
        .content {
          background: var(--bg-card, #ffffff);
          padding: 30px;
          border-radius: 0 0 10px 10px;
          border: 1px solid var(--border-ui, #e7e2d8);
        }
        .session-card {
          background: var(--bg-elevated, #f1ece3);
          padding: 20px;
          border-radius: 10px;
          margin: 20px 0;
          border-left: 4px solid #d97706;
        }
        .button {
          display: inline-block;
          background: #d97706;
          color: white;
          padding: 12px 24px;
          text-decoration: none;
          border-radius: 5px;
          margin: 20px 0;
          font-weight: bold;
        }
        .reminder-badge {
          background: #fef3c7;
          color: #92400e;
          padding: 5px 10px;
          border-radius: 5px;
          font-size: 12px;
          display: inline-block;
        }
        .footer {
          text-align: center;
          padding: 20px;
          font-size: 12px;
          color: var(--text-muted, #57534e);
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h2>⏰ Session Reminder</h2>
      </div>
      <div class="content">
        <p>Dear <strong>${name}</strong>,</p>
        <p>This is a reminder that your training session starts soon!</p>
        
        <div class="session-card">
          <h3 style="color: #d97706; margin-top: 0;">${sessionTitle}</h3>
          <p><strong>📅 Date:</strong> ${formattedDate}</p>
          <p><strong>⏰ Time:</strong> ${sessionTime}</p>
          ${meetingLink ? `<p><strong>🔗 Meeting Link:</strong> <a href="${meetingLink}" style="color: #d97706;">Join Session</a></p>` : ''}
        </div>
        
        <div style="text-align: center;">
          <a href="${meetingLink || `${process.env.FRONTEND_URL}/sessions`}" class="button">
            ${meetingLink ? 'Join Session Now' : 'View Session Details'}
          </a>
        </div>
        
        <div class="reminder-badge">
          Please join 10 minutes before the session starts
        </div>
        
        <p>Need help? Contact us at <a href="mailto:${process.env.SUPPORT_EMAIL || 'support@aicn.africa'}" style="color: #d97706;">${process.env.SUPPORT_EMAIL || 'support@aicn.africa'}</a></p>
      </div>
      <div class="footer">
        <p>© ${new Date().getFullYear()} AICN Training. All rights reserved.</p>
        <p>Africa ICT & CS Network — Empowering Africa Digitally, Transforming Lives</p>
      </div>
    </body>
    </html>
  `;

  return await sendEmail({
    to,
    subject: `⏰ Reminder: ${sessionTitle} starts soon!`,
    html,
  });
}

module.exports = {
  sendCertificateEmail,
  sendEnrolmentConfirmationEmail,
  sendTrainerApprovalEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendSessionReminderEmail
};
