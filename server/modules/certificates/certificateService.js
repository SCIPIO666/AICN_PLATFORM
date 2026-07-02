const certificateModel = require('./certificatesModel');
const { sendCertificateEmail } = require('../../utils/email/email services/aicnEmailsService');
const generatePdfAndUpload = require('../../utils/pdf/generatePdfAndUpload');
const { prisma } = require('../../config/db');
const logger = require('../../utils/logger');
const { AuthorizationError, NotFoundError, BusinessLogicError } = require('../../utils/errors/customErrors');


//helpers
function assertAdmin(role) {
  if (role !== 'ADMIN') {
    throw new AuthorizationError('Only administrators can issue certificates');
  }
}

function mapUploadResult(uploadResult) {
  return {
    pdfUrl: uploadResult.secureUrl,
    pdfPublicId: uploadResult.publicId,
    pdfVersion: Number(uploadResult.version || 1),
    pdfSize: Number(uploadResult.bytes || 0),
    pdfFormat: uploadResult.format || 'pdf',
    pdfResourceType: uploadResult.resourceType || 'raw',
    pdfCreatedAt: new Date(uploadResult.createdAt || Date.now()),
    pdfEtag: uploadResult.etag || null,
    pdfSignature: uploadResult.signature || null,
    pdfAssetFolder: uploadResult.assetFolder || null,
    pdfOriginalFilename: uploadResult.originalFilename || null,
    pdfGenerationFailed: false,
    pdfFailureReason: null,
    pdfFailedAt: null,
  };
}

async function issueCertificate(userId, sessionId, adminId, role) {
  assertAdmin(role);

  const enrolment = await prisma.enrolment.findFirst({
    where: { userId, sessionId, status: 'ATTENDED' },
    include: { user: true, session: { include: { trainer: true } } },
  });

  if (!enrolment) {
    throw new BusinessLogicError('User has not completed the session');
  }

  const existingCert = await certificateModel.getCertificateByUserAndSession(userId, sessionId);
  if (existingCert && !existingCert.revokedAt) {
    throw new BusinessLogicError('Certificate already issued for this session');
  }

  const certificate = await certificateModel.createCertificate(userId, sessionId);
  let pdfBuffer;
  let uploadResult;

  try {
    logger.info(`starting certificate generation for ${enrolment.user.name}-${enrolment.session.title}`)
    ({ pdfBuffer, uploadResult } = await generatePdfAndUpload({
      userId,
      certificateId: certificate.id,
      certCode: certificate.certCode,
      userName: enrolment.user.name,
      sessionTitle: enrolment.session.title,
      skillArea: enrolment.session.skillArea,
      duration: enrolment.session.durationMins,
      trainerName: enrolment.session.trainer?.name || 'AICN Training Faculty',
      issueDate: certificate.issuedAt,
      completionDate: enrolment.session.date,
      verifyUrl: `${process.env.FRONTEND_URL}/verify/${certificate.certCode}`,
    }));

    await prisma.certificate.update({
      where: { id: certificate.id },
      data: mapUploadResult(uploadResult),
    });

    await prisma.enrolment.update({
      where: { userId_sessionId: { userId, sessionId } },
      data: { certificate: true },
    });
  } catch (error) {
    logger.error(`Certificate PDF failed for ${certificate.certCode}: ${error.message}`);
    await prisma.certificate.update({
      where: { id: certificate.id },
      data: {
        pdfGenerationFailed: true,
        pdfFailureReason: error.message.slice(0, 255),
        pdfFailedAt: new Date(),
      },
    });
    throw new BusinessLogicError('Certificate was created, but PDF generation or storage failed. Please retry the PDF step before sharing it.');
  }

  let emailSent = false;
  try {
    await sendCertificateEmail({
      to: enrolment.user.email,
      name: enrolment.user.name,
      sessionTitle: enrolment.session.title,
      certCode: certificate.certCode,
      pdfBuffer,
      meta: {
        skillArea: enrolment.session.skillArea,
        durationMins: enrolment.session.durationMins,
      },
    });
    emailSent = true;
    logger.info(`Certificate email sent to ${enrolment.user.email}`);
  } catch (error) {
    logger.error(`Certificate stored, but email failed for ${enrolment.user.email}: ${error.message}`);
  }

  const issuedCertificate = await certificateModel.getCertificateById(certificate.id);
  return {
    ...issuedCertificate,
    emailSent,
    pdfDetails: {
      url: uploadResult.secureUrl,
      publicId: uploadResult.publicId,
      size: uploadResult.bytes,
      local: Boolean(uploadResult.local),
    },
  };
}

async function batchIssueCertificates(sessionId, adminId, role) {
  assertAdmin(role);

  const attendedEnrolments = await prisma.enrolment.findMany({
    where: { sessionId, status: 'ATTENDED', certificate: false },
    include: { user: true, session: { include: { trainer: true } } },
  });

  if (attendedEnrolments.length === 0) {
    throw new BusinessLogicError('No eligible users found for this session');
  }

  const results = { issued: 0, failed: 0, errors: [] };

  for (const enrolment of attendedEnrolments) {
    try {
      await issueCertificate(enrolment.userId, sessionId, adminId, role);
      results.issued += 1;
    } catch (error) {
      results.failed += 1;
      results.errors.push({
        userId: enrolment.userId,
        userName: enrolment.user.name,
        error: error.message,
      });
    }
  }

  return results;
}

async function verifyCertificate(certCode) {
  const certificate = await certificateModel.getCertificateByCode(certCode);
  if (!certificate) throw new NotFoundError('Certificate');
  if (certificate.revokedAt) throw new BusinessLogicError('Certificate has been revoked');
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
      totalPages: Math.ceil(certificates.length / limit),
    },
  };
}

async function getCertificate(id) {
  const certificate = await certificateModel.getCertificateById(id);
  if (!certificate) throw new NotFoundError('Certificate');
  return certificate;
}

async function getCertificateForDownload(id, requester) {
  const certificate = await getCertificate(id);

  if (certificate.revokedAt) {
    throw new BusinessLogicError('Certificate has been revoked');
  }

  if (!certificate.pdfUrl) {
    throw new BusinessLogicError('Certificate PDF is not ready yet');
  }

  const isOwner = certificate.userId === requester.id;
  const isAdmin = requester.role === 'ADMIN';
  if (!isOwner && !isAdmin) {
    throw new AuthorizationError('You can only download your own certificates');
  }

  return certificate;
}

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
      hasPrevPage: page > 1,
    },
  };
}

async function getCertificateStats() {
  return certificateModel.getCertificateStats();
}

module.exports = {
  verifyCertificate,
  getUserCertificates,
  getCertificate,
  getCertificateForDownload,
  batchIssueCertificates,
  issueCertificate,
  getAllCertificates,
  getCertificateStats,
};
