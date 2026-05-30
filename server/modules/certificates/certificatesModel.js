const {prisma} = require('../../config/db');
const logger = require('../../utils/logger');
const crypto = require('crypto');

function generateCertCode() {
  return `CERT-${crypto.randomBytes(8).toString('hex').toUpperCase()}`;
}

async function createCertificate(userId, sessionId) {
  try {
    return await prisma.certificate.create({
      data: {
        userId,
        sessionId,
        certCode: generateCertCode()
      },
      include: {
        user: {
          select: { id: true, name: true, email: true }
        },
        session: {
          select: { id: true, title: true, skillArea: true, date: true }
        }
      }
    });
  } catch (error) {
    logger.error(`Failed to create certificate: ${error.message}`);
    throw error;
  }
}

async function getCertificateById(id) {
  try {
    return await prisma.certificate.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, name: true, email: true }
        },
        session: true
      }
    });
  } catch (error) {
    logger.error(`Failed to get certificate: ${error.message}`);
    throw error;
  }
}

async function getCertificateByCode(certCode) {
  try {
    return await prisma.certificate.findUnique({
      where: { certCode },
      include: {
        user: {
          select: { id: true, name: true, email: true }
        },
        session: true
      }
    });
  } catch (error) {
    logger.error(`Failed to get certificate by code: ${error.message}`);
    throw error;
  }
}

async function getUserCertificates(userId) {
  try {
    return await prisma.certificate.findMany({
      where: { userId },
      include: {
        session: {
          select: { id: true, title: true, skillArea: true, date: true }
        }
      },
      orderBy: { issuedAt: 'desc' }
    });
  } catch (error) {
    logger.error(`Failed to get user certificates: ${error.message}`);
    throw error;
  }
}

async function getSessionCertificates(sessionId) {
  try {
    return await prisma.certificate.findMany({
      where: { sessionId },
      include: {
        user: {
          select: { id: true, name: true, email: true }
        }
      }
    });
  } catch (error) {
    logger.error(`Failed to get session certificates: ${error.message}`);
    throw error;
  }
}

module.exports = {
  createCertificate,
  getCertificateById,
  getCertificateByCode,
  getUserCertificates,
  getSessionCertificates
};