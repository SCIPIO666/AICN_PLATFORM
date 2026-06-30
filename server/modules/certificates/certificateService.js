// certificates/certificateService.js
const certificateModel = require('./certificatesModel');
const { getSession } = require('../sessions/sessionsModel');
const { sendCertificateEmail } = require('../../utils/email/email services/aicnEmailsService');
const uploadPdf = require('../../utils/storage/uploadPdf');
const { generateCertificatePDF } = require('../../utils/pdf/templates/certificates/certificateGenerator');
const {prisma} = require('../../config/db');
const logger = require('../../utils/logger');
const { AuthorizationError, NotFoundError, BusinessLogicError } = require('../../utils/errors/customErrors');

async function issueCertificate(userId, sessionId, adminId, role) {
  if (role !== 'ADMIN') {
    throw new AuthorizationError('Only administrators can issue certificates');
  }

  const enrolment = await prisma.enrolment.findFirst({
    where: { userId, sessionId, status: 'ATTENDED' },
    include: { user: true, session: { include: { trainer: true } } }
  });
  
  if (!enrolment) {
    throw new BusinessLogicError('User has not completed the session');
  }
  
  const existingCert = await certificateModel.getCertificateByUserAndSession(userId, sessionId);
  if (existingCert && !existingCert.revokedAt) {
    throw new BusinessLogicError('Certificate already issued for this session');
  }
  
  const certificate = await certificateModel.createCertificate(userId, sessionId);
  
  try {
    const pdfBuffer = await generateCertificatePDF({
      certCode: certificate.certCode,
      userName: enrolment.user.name,
      sessionTitle: enrolment.session.title,
      sessionDate: enrolment.session.date,
      skillArea: enrolment.session.skillArea,
      duration: enrolment.session.durationMins,
      trainerName: enrolment.session.trainer?.name || 'AICN Training Faculty',
      issueDate: certificate.issuedAt,
      verifyUrl: `${process.env.FRONTEND_URL}/verify/${certificate.certCode}`
    });
    
    await sendCertificateEmail(
      enrolment.user.email,
      enrolment.user.name,
      enrolment.session.title,
      certificate.certCode,
      pdfBuffer,
      { skillArea: enrolment.session.skillArea, durationMins: enrolment.session.durationMins }
    );
    
    logger.info(`Certificate issued and emailed to ${enrolment.user.email}`);
    
    const uploadResult = await uploadPdf(pdfBuffer, userId, certificate.id);
    
    await prisma.certificate.update({
      where: { id: certificate.id },
      data: {
        pdfUrl: uploadResult.secureUrl,
        pdfPublicId: uploadResult.publicId,
        pdfVersion: uploadResult.version,
        pdfSize: uploadResult.bytes,
        pdfFormat: uploadResult.format,
        pdfResourceType: uploadResult.resourceType,
        pdfCreatedAt: new Date(uploadResult.createdAt),
        pdfEtag: uploadResult.etag,
        pdfSignature: uploadResult.signature,
        pdfAssetFolder: uploadResult.assetFolder,
        pdfOriginalFilename: uploadResult.originalFilename
      }
    });
    
    logger.info(`Certificate PDF stored at: ${uploadResult.secureUrl}`);
    
    return {
      ...certificate,
      pdfDetails: { url: uploadResult.secureUrl, publicId: uploadResult.publicId, size: uploadResult.bytes, version: uploadResult.version }
    };
    
  } catch (error) {
    logger.error(`Certificate issued but storage/email failed: ${error.message}`);
    await prisma.certificate.update({
      where: { id: certificate.id },
      data: { pdfGenerationFailed: true, pdfFailureReason: error.message, pdfFailedAt: new Date() }
    });
    return certificate;
  }
}

async function batchIssueCertificates(sessionId, adminId, role) {
  if (role !== 'ADMIN') {
    throw new AuthorizationError('Only administrators can issue certificates');
  }
  
  const attendedEnrolments = await prisma.enrolment.findMany({
    where: { sessionId, status: 'ATTENDED', certificate: false },
    include: { user: true, session: { include: { trainer: true } } }
  });
  
  if (attendedEnrolments.length === 0) {
    throw new BusinessLogicError('No eligible users found for this session');
  }
  
  const results = { issued: 0, failed: 0, errors: [] };
  
  for (const enrolment of attendedEnrolments) {
    try {
      await issueCertificate(enrolment.userId, sessionId, adminId, role);
      results.issued++;
      await prisma.enrolment.update({
        where: { sessionId, status: 'ATTENDED',userId:enrolment.userId },
        data : { certificate: true}
      })
    } catch (error) {
      results.failed++;
      results.errors.push({ userId: enrolment.userId, userName: enrolment.user.name, error: error.message });
    }
  }
  
  return results;
}

async function verifyCertificate(certCode) {
  const certificate = await certificateModel.getCertificateByCode(certCode);
  if (!certificate) {
    throw new NotFoundError('Certificate');
  }
  if (certificate.revokedAt) {
    throw new BusinessLogicError('Certificate has been revoked');
  }
  return certificate;
}

async function getUserCertificates(userId, options = {}) {
  const certificates = await certificateModel.getUserCertificates(userId);
  const page = parseInt(options.page) || 1;
  const limit = parseInt(options.limit) || 10;
  const start = (page - 1) * limit;
  const paginated = certificates.slice(start, start + limit);
  
  return {
    certificates: paginated,
    pagination: {
      page,
      limit,
      total: certificates.length,
      totalPages: Math.ceil(certificates.length / limit)
    }
  };
}

async function getCertificate(id) {
  const certificate = await certificateModel.getCertificateById(id);
  if (!certificate) throw new NotFoundError('Certificate');
  return certificate;
}

/**
 * Get all certificates with pagination (Admin only)
 */
async function getAllCertificates(filters = {}, page = 1, limit = 10) {
  const skip = (page - 1) * limit;
  const result = await certificateModel.getAllCertificates(filters, skip, limit);
  
  return {
    certificates: result.certificates,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: result.total,
      totalPages: Math.ceil(result.total / limit),
      hasNextPage: page < Math.ceil(result.total / limit),
      hasPrevPage: page > 1
    }
  };
}

/**
 * Get certificate statistics (Admin only)
 */
async function getCertificateStats() {
  return await certificateModel.getCertificateStats();
}

module.exports = { verifyCertificate, getUserCertificates, getCertificate, batchIssueCertificates, issueCertificate, getAllCertificates, getCertificateStats };