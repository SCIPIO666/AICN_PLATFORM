const prisma = require('../../config/db');
const logger = require('../../utils/logger');

async function createEnrolment(data) {
  try {
    return await prisma.enrolment.create({
      data,
      include: {
        user: {
          select: { id: true, name: true, email: true }
        },
        session: true
      }
    });
  } catch (error) {
    logger.error(`Failed to create enrolment: ${error.message}`);
    throw error;
  }
}

async function getEnrolmentById(id) {
  try {
    return await prisma.enrolment.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, name: true, email: true, phone: true }
        },
        session: {
          include: {
            trainer: {
              select: { id: true, name: true, email: true }
            }
          }
        }
      }
    });
  } catch (error) {
    logger.error(`Failed to get enrolment: ${error.message}`);
    throw error;
  }
}

async function getAllEnrolments(filters = {}, skip = 0, take = 10) {
  try {
    const where = {};
    if (filters.userId) where.userId = filters.userId;
    if (filters.sessionId) where.sessionId = filters.sessionId;
    if (filters.status) where.status = filters.status;
    
    const [enrolments, total] = await Promise.all([
      prisma.enrolment.findMany({
        where,
        skip,
        take,
        include: {
          user: {
            select: { id: true, name: true, email: true }
          },
          session: {
            select: {
              id: true,
              title: true,
              date: true,
              skillArea: true,
              status: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.enrolment.count({ where })
    ]);
    
    return { enrolments, total };
  } catch (error) {
    logger.error(`Failed to get enrolments: ${error.message}`);
    throw error;
  }
}

async function updateEnrolment(id, data) {
  try {
    return await prisma.enrolment.update({
      where: { id },
      data,
      include: {
        user: {
          select: { id: true, name: true, email: true }
        },
        session: true
      }
    });
  } catch (error) {
    logger.error(`Failed to update enrolment: ${error.message}`);
    throw error;
  }
}

async function deleteEnrolment(id) {
  try {
    return await prisma.enrolment.delete({ where: { id } });
  } catch (error) {
    logger.error(`Failed to delete enrolment: ${error.message}`);
    throw error;
  }
}

async function findEnrolmentByUserAndSession(userId, sessionId) {
  try {
    return await prisma.enrolment.findUnique({
      where: {
        userId_sessionId: {
          userId,
          sessionId
        }
      }
    });
  } catch (error) {
    logger.error(`Failed to find enrolment: ${error.message}`);
    throw error;
  }
}

module.exports = {
  createEnrolment,
  getEnrolmentById,
  getAllEnrolments,
  updateEnrolment,
  deleteEnrolment,
  findEnrolmentByUserAndSession
};