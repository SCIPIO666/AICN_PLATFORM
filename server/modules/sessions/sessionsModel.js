const prisma = require('../../config/db');
const logger = require('../../utils/logger');

async function createSession(data) {
  try {
    const newSession = await prisma.session.create({ data });
    return newSession;
  } catch (error) {
    logger.error(`Failed to create session: ${error.message}`);
    throw error;
  }
}

async function getSession(id) {
  try {
    const session = await prisma.session.findUnique({
      where: { id },
      include: {
        trainer: { select: { id: true, name: true, email: true } },
        enrolments: {
          include: { user: { select: { id: true, name: true, email: true } } }
        },
        _count: { select: { enrolments: true } }
      }
    });
    if (!session) throw new Error('Session not found');
    return session;
  } catch (error) {
    logger.error(`Failed to get a session: ${error.message}`);
    throw error;
  }
}

async function getAllSessions(filters = {}) {
  try {
    const { title, skillArea, status, locationType, county, trainerId, page = 1, limit = 10 } = filters;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const where = {};
    if (title) where.title = { contains: title, mode: 'insensitive' };
    if (skillArea) where.skillArea = { contains: skillArea, mode: 'insensitive' };
    if (status) where.status = status;
    if (locationType) where.locationType = locationType;
    if (county) where.county = { contains: county, mode: 'insensitive' };
    if (trainerId) where.trainerId = trainerId;
    
    const [sessions, total] = await Promise.all([
      prisma.session.findMany({
        where,
        skip,
        take: parseInt(limit),
        include: {
          trainer: { select: { id: true, name: true, email: true } },
          _count: { select: { enrolments: true } }
        },
        orderBy: { date: 'asc' }
      }),
      prisma.session.count({ where })
    ]);
    
    return {
      sessions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit))
      }
    };
  } catch (error) {
    logger.error(`Failed finding all sessions: ${error.message}`);
    throw error;
  }
}

async function updateSession(id, data) {
  try {
    return await prisma.session.update({ where: { id }, data });
  } catch (error) {
    logger.error(`Failed to update session: ${error.message}`);
    throw error;
  }
}

async function deleteSession(id) {
  try {
    const existingSession = await prisma.session.findUnique({ where: { id } });
    if (!existingSession) {
      throw new Error(`Session with id ${id} not found`);
    }
    
    const deletedSession = await prisma.session.delete({ where: { id } });
    return deletedSession;
  } catch (error) {
    logger.error(error.message);
    throw error;
  }
}

module.exports = {
  createSession,
  getSession,
  getAllSessions,
  updateSession,
  deleteSession
};