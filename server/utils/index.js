sendEmail({to,subject,html,attachments = []}) 
generateCertificatePDF(data)  /pdfBuffer

generateCertificateHTML(data)
/**
 * Generate HTML content for certificate with all data injected
 * @param {Object} data - Certificate data
 * @returns {Promise<string>} Complete HTML string
 * 
 * Expected data object structure:
 * {
 *   verifyUrl: string,
 *   userName: string,
 *   sessionTitle: string,
 *   skillArea: string,
 *   duration: string | number,
 *   completionDate: Date | string,
 *   issueDate: Date | string,
 *   trainerName: string,
 *   certCode: string
 * }
 */

  sendEnrolmentConfirmationEmail,
  sendTrainerApprovalEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail

sendCertificateEmail({ to,name,sessionTitle,certCode,pdfBuffer}) 