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
 async function getCertificateByUserAndSession(userId, sessionId){
 try {
    return await prisma.certificate.findFirst({
      where: { userId, sessionId },
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

 async function getAllCertificates(filters = {}, skip = 0, take = 10) {
  try {
    const { search, status, fromDate, toDate, sortBy = 'issuedAt', sortOrder = 'desc' } = filters;
    
    const where = {};
    
    // Search by certCode, user name, email, or session title
    if (search) {
      where.OR = [
        { certCode: { contains: search, mode: 'insensitive' } },
        { user: { name: { contains: search, mode: 'insensitive' } } },
        { user: { email: { contains: search, mode: 'insensitive' } } },
        { session: { title: { contains: search, mode: 'insensitive' } } }
      ];
    }
    
    // Filter by status (active/revoked)
    if (status === 'active') {
      where.revokedAt = null;
    } else if (status === 'revoked') {
      where.revokedAt = { not: null };
    }
    
    // Date range
    if (fromDate) {
      where.issuedAt = { gte: new Date(fromDate) };
    }
    if (toDate) {
      where.issuedAt = { ...where.issuedAt, lte: new Date(toDate) };
    }
    
    // Build order by
    const orderBy = {};
    orderBy[sortBy] = sortOrder;
    
    const [certificates, total] = await Promise.all([
      prisma.certificate.findMany({
        where,
        skip,
        take,
        include: {
          user: {
            select: { id: true, name: true, email: true }
          },
          session: {
            select: { id: true, title: true, skillArea: true, date: true }
          }
        },
        orderBy
      }),
      prisma.certificate.count({ where })
    ]);
    
    return { certificates, total };
  } catch (error) {
    logger.error(`Failed to get all certificates: ${error.message}`);
    throw error;
  }
}
 /**
 * Get certificate statistics (Admin only)
 */
async function getCertificateStats() {
  try {
    const [total, active, revoked, thisMonth] = await Promise.all([
      prisma.certificate.count(),
      prisma.certificate.count({ where: { revokedAt: null } }),
      prisma.certificate.count({ where: { revokedAt: { not: null } } }),
      prisma.certificate.count({
        where: {
          issuedAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
            lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1)
          }
        }
      })
    ]);
    
    return { total, active, revoked, thisMonth };
  } catch (error) {
    logger.error(`Failed to get certificate stats: ${error.message}`);
    throw error;
  }
}


module.exports = {
  getCertificateByUserAndSession,
  createCertificate,
  getCertificateById,
  getCertificateByCode,
  getUserCertificates,
  getSessionCertificates,
   getAllCertificates,   
  getCertificateStats,   

};