
const {prisma }= require('../../config/db');
const logger = require('../../utils/logger');

async function createSession(data) {
  try {
    return await prisma.session.create({ data });
  } catch (error) {
    logger.error(`Failed to create session: ${error.message}`);
    throw error;
  }
}

async function getSession(id) {
  try {
    const session = await prisma.session.findUnique({
      where: { id },
      include: { trainer: { select: { id: true, name: true, email: true } }, enrolments: { include: { user: { select: { id: true, name: true, email: true } } } }, _count: { select: { enrolments: true } } }
    });
    if (!session) throw new Error('Session not found');
    return session;
  } catch (error) {
    logger.error(`Failed to get session: ${error.message}`);
    throw error;
  }
}

async function getAllSessions(filters = {}) {
  try {
    const { title, skillArea, status, locationType, county, trainerId, fromDate, toDate, page = 1, limit = 10 } = filters;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const where = {};
    if (title) where.title = { contains: title, mode: 'insensitive' };
    if (skillArea) where.skillArea = { contains: skillArea, mode: 'insensitive' };
    if (status) where.status = status;
    if (locationType) where.locationType = locationType;
    if (county) where.county = { contains: county, mode: 'insensitive' };
    if (trainerId) where.trainerId = trainerId;
    if (fromDate) where.date = { gte: new Date(fromDate) };
    if (toDate) where.date = { ...where.date, lte: new Date(toDate) };
    
    const [sessions, total] = await Promise.all([
      prisma.session.findMany({
        where, skip, take: parseInt(limit),
        include: { trainer: { select: { id: true, name: true, email: true } }, _count: { select: { enrolments: true } } },
        orderBy: { date: 'asc' }
      }),
      prisma.session.count({ where })
    ]);
    
    return { sessions, total, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(total / parseInt(limit)) };
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
    if (!existingSession) throw new Error(`Session with id ${id} not found`);
    return await prisma.session.delete({ where: { id } });
  } catch (error) {
    logger.error(error.message);
    throw error;
  }
}

module.exports = { createSession, getSession, getAllSessions, updateSession, deleteSession };