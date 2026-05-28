
const certificateModel = require('./certificatesModel');
const { getSession } = require('../sessions/sessionsModel');
const {sendCertificateEmail}= require('../../utils/email/email services/aicnEmailsService')
const uploadPdf=require('../../utils/media storage/uploadPdf')
const {generateCertificatePDF}  = require('../../utils/pdf/templates/certificates/certificateGenerator')
const prisma = require('../../config/db');
const logger = require('../../utils/logger');

async function issueCertificate(userId, sessionId, adminId, role) {
  if (role !== 'ADMIN') {
    throw new Error('Only ADMIN can issue certificates');
  }

  const enrolment = await prisma.enrolment.findFirst({
    where: {
      userId,
      sessionId,
      status: 'ATTENDED'
    },
    include: {
      user: true,
      session: {
        include: {
          trainer: true
        }
      }
    }
  });
  
  if (!enrolment) {
    throw new Error('User has not completed the session');
  }
  
  // Check if certificate already exists and not revoked
  const existingCert = await certificateModel.getCertificateByUserAndSession(userId, sessionId);
  if (existingCert && !existingCert.revokedAt) {
    throw new Error('Certificate already issued for this session');
  }
  
  // Create certificate record
  const certificate = await certificateModel.createCertificate(userId, sessionId);
  
  try {
    // Generate PDF
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
    
    // Send email with PDF attachment
    await sendCertificateEmail(
      enrolment.user.email,
      enrolment.user.name,
      enrolment.session.title,
      certificate.certCode,
      pdfBuffer,
      {
        skillArea: enrolment.session.skillArea,
        durationMins: enrolment.session.durationMins
      }
    );
    
    logger.info(`Certificate issued and emailed to ${enrolment.user.email}`);
    
    // Upload to Cloudinary and get all PDF details
    const uploadResult = await uploadPdf(pdfBuffer, userId, certificate.id);
    
    // Update certificate with ALL PDF details
    await prisma.certificate.update({
      where: { id: certificate.id },
      data: {
        // Core storage info
        pdfUrl: uploadResult.secureUrl,
        pdfPublicId: uploadResult.publicId,
        
        // Additional metadata (add these fields to your schema first)
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
    logger.info(`PDF Size: ${(uploadResult.bytes / 1024).toFixed(2)} KB`);
    
    return {
      ...certificate,
      pdfDetails: {
        url: uploadResult.secureUrl,
        publicId: uploadResult.publicId,
        size: uploadResult.bytes,
        version: uploadResult.version
      }
    };
    
  } catch (error) {
    // Log error but still return certificate record
    logger.error(`Certificate issued but storage/email failed: ${error.message}`);
    
    // Optionally mark certificate as failed for retry
    await prisma.certificate.update({
      where: { id: certificate.id },
      data: { 
        pdfGenerationFailed: true,
        pdfFailureReason: error.message,
        pdfFailedAt: new Date()
      }
    });
    
    return certificate;
  }
}

async function batchIssueCertificates(sessionId, adminId, role) {
  if (role !== 'ADMIN') {
    throw new Error('Only ADMIN can issue certificates');
  }
  
  //  all ATTENDED enrolments without certificates
  const attendedEnrolments = await prisma.enrolment.findMany({
    where: {
      sessionId,
      status: 'ATTENDED',
      certificate: null
    },
    include: {
      user: true,
      session: {
        include: {
          trainer: true
        }
      }
    }
  });
  
  const results = {
    issued: 0,
    failed: 0,
    errors: []
  };
  
  for (const enrolment of attendedEnrolments) {
    try {
      await issueCertificate(
        enrolment.userId,
        sessionId,
        adminId,
        role
      );
      results.issued++;
    } catch (error) {
      results.failed++;
      results.errors.push({
        userId: enrolment.userId,
        userName: enrolment.user.name,
        error: error.message
      });
    }
  }
  
  return results;
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
  verifyCertificate,
  getUserCertificates,
  getCertificate,
    batchIssueCertificates,
    issueCertificate,

};