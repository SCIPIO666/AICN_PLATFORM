const certificateModel = require('./certificatesModel');
const { getEnrolmentById } = require('../enrollments/enrolmentsModel');
const { getSession } = require('../sessions/sessionsModel');

async function issueCertificate(userId, sessionId, adminId, role) {
  if (role !== 'ADMIN') {
    throw new Error('Only ADMIN can issue certificates');
  }
  
  // user completed the session
  const enrolment = await getEnrolmentById(sessionId);
  if (!enrolment || enrolment.status !== 'ATTENDED') {
    throw new Error('User has not completed the session');
  }
  
  // certificate already exists
  const existingCerts = await certificateModel.getUserCertificates(userId);
  const alreadyHasCert = existingCerts.some(cert => cert.sessionId === sessionId);
  if (alreadyHasCert) {
    throw new Error('Certificate already issued for this session');
  }
  
  return await certificateModel.createCertificate(userId, sessionId);
}

async function verifyCertificate(certCode) {
  const certificate = await certificateModel.getCertificateByCode(certCode);
  if (!certificate) {
    throw new Error('Invalid certificate code');
  }
  return certificate;
}

async function getUserCertificates(userId) {
  return await certificateModel.getUserCertificates(userId);
}

async function getCertificate(id) {
  const certificate = await certificateModel.getCertificateById(id);
  if (!certificate) {
    throw new Error('Certificate not found');
  }
  return certificate;
}

module.exports = {
  issueCertificate,
  verifyCertificate,
  getUserCertificates,
  getCertificate
};