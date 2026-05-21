const fs = require('fs');
const path = require('path');
const Handlebars = require('handlebars');
const { transporter } = require('../../config/email');
const logger = require('../logger');

// Load and compile Handlebars templates
const loadTemplate = (templateName) => {
  const templatePath = path.join(__dirname, 'emailTemplates', `${templateName}.hbs`);
  const templateSource = fs.readFileSync(templatePath, 'utf8');
  return Handlebars.compile(templateSource);
};

// Pre-compile templates
const templates = {
  welcome: loadTemplate('welcome'),
  certificate: loadTemplate('certificate'),
  enrolmentConfirmation: loadTemplate('enrolmentConfirmation'),
  trainerApproval: loadTemplate('trainerApproval')
};

/**
 * Send welcome email to new users
 */
const sendWelcomeEmail = async (to, name) => {
  try {
    const html = templates.welcome({
      name,
      frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000'
    });

    const info = await transporter.sendMail({
      from: `"AICN Training" <${process.env.SMTP_FROM || 'noreply@aicn.com'}>`,
      to,
      subject: 'Welcome to AICN Training!',
      html,
      text: `Welcome ${name}! Thank you for joining AICN Training.`
    });

    logger.info(`Welcome email sent to ${to}: ${info.messageId}`);
    return info;
  } catch (error) {
    logger.error(`Failed to send welcome email: ${error.message}`);
    throw new Error('Failed to send welcome email');
  }
};

/**
 * Send certificate email with PDF attachment
 */
const sendCertificateEmail = async (to, name, sessionTitle, certCode, pdfBuffer, sessionDetails = {}) => {
  try {
    const verifyUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify/${certCode}`;
    
    const html = templates.certificate({
      name,
      sessionTitle,
      certCode,
      verifyUrl,
      skillArea: sessionDetails.skillArea || 'General',
      duration: sessionDetails.durationMins || 120,
      issueDate: new Date().toLocaleDateString()
    });

    const info = await transporter.sendMail({
      from: `"AICN Training" <${process.env.SMTP_FROM || 'noreply@aicn.com'}>`,
      to,
      subject: `Your Certificate for ${sessionTitle}`,
      html,
      text: `Congratulations ${name}! You have completed ${sessionTitle}. Your certificate code is: ${certCode}`,
      attachments: [
        {
          filename: `AICN_Certificate_${certCode}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf'
        }
      ]
    });

    logger.info(`Certificate email sent to ${to}: ${info.messageId}`);
    return info;
  } catch (error) {
    logger.error(`Failed to send certificate email: ${error.message}`);
    throw new Error('Failed to send certificate email');
  }
};

/**
 * Send enrolment confirmation email
 */
const sendEnrolmentConfirmation = async (to, name, session) => {
  try {
    const sessionDate = new Date(session.date);
    const html = templates.enrolmentConfirmation({
      name,
      sessionTitle: session.title,
      sessionDate: sessionDate.toLocaleDateString(),
      sessionTime: sessionDate.toLocaleTimeString(),
      location: session.locationType === 'ONLINE' ? 'Online (link provided separately)' : session.venue,
      duration: session.durationMins,
      sessionId: session.id,
      frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000'
    });

    const info = await transporter.sendMail({
      from: `"AICN Training" <${process.env.SMTP_FROM || 'noreply@aicn.com'}>`,
      to,
      subject: `Enrolment Confirmation: ${session.title}`,
      html,
      text: `You have successfully enrolled in ${session.title} on ${sessionDate.toLocaleDateString()}`
    });

    logger.info(`Enrolment confirmation sent to ${to}: ${info.messageId}`);
    return info;
  } catch (error) {
    logger.error(`Failed to send enrolment confirmation: ${error.message}`);
    // Don't throw - enrolment should succeed even if email fails
    return null;
  }
};

/**
 * Send trainer application status email
 */
const sendTrainerStatusEmail = async (to, name, status) => {
  try {
    const html = templates.trainerApproval({
      name,
      approved: status === 'APPROVED',
      frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000'
    });

    const subject = status === 'APPROVED' 
      ? 'Trainer Application Approved! 🎉' 
      : 'Trainer Application Update';

    const info = await transporter.sendMail({
      from: `"AICN Training" <${process.env.SMTP_FROM || 'noreply@aicn.com'}>`,
      to,
      subject,
      html,
      text: status === 'APPROVED' 
        ? `Congratulations ${name}! Your trainer application has been approved.`
        : `Dear ${name}, your trainer application has been reviewed. Please log in for more details.`
    });

    logger.info(`Trainer status email sent to ${to}: ${info.messageId}`);
    return info;
  } catch (error) {
    logger.error(`Failed to send trainer status email: ${error.message}`);
    throw new Error('Failed to send trainer status email');
  }
};

/**
 * Send bulk certificate emails
 */
const sendBulkCertificateEmails = async (recipients) => {
  const results = {
    sent: 0,
    failed: 0,
    errors: []
  };

  for (const recipient of recipients) {
    try {
      await sendCertificateEmail(
        recipient.email,
        recipient.name,
        recipient.sessionTitle,
        recipient.certCode,
        recipient.pdfBuffer,
        recipient.sessionDetails
      );
      results.sent++;
    } catch (error) {
      results.failed++;
      results.errors.push({
        email: recipient.email,
        error: error.message
      });
    }
  }

  return results;
};

module.exports = {
  sendWelcomeEmail,
  sendCertificateEmail,
  sendEnrolmentConfirmation,
  sendTrainerStatusEmail,
  sendBulkCertificateEmails
};