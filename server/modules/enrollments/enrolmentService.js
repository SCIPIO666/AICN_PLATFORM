const enrolmentModel = require('./enrolmentsModel');
const { getSession } = require('../sessions/sessionsModel');
const logger = require('../../utils/logger');

async function createEnrolment(userId, sessionId) {
  const session = await getSession(sessionId);
  if (!session) throw new Error('Session not found');
  if (session.status !== 'SCHEDULED') throw new Error('Session is not available for enrolment');
  
  // capacity
  const enrolmentCount = session._count?.enrolments || session.enrolments?.length || 0;
  if (enrolmentCount >= session.capacity) {
    throw new Error('Session is at full capacity');
  }
  
  // if already enrolled
  const existingEnrolment = await enrolmentModel.findEnrolmentByUserAndSession(userId, sessionId);
  if (existingEnrolment) {
    throw new Error('Already enrolled in this session');
  }
  
  return await enrolmentModel.createEnrolment({ userId, sessionId, status: 'ENROLLED' });
}

async function getAllEnrolments(filters = {}, page = 1, limit = 10) {
  const skip = (page - 1) * limit;
  const { enrolments, total } = await enrolmentModel.getAllEnrolments(filters, skip, limit);
  
  return {
    data: enrolments,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
}

async function getEnrolment(id) {
  const enrolment = await enrolmentModel.getEnrolmentById(id);
  if (!enrolment) throw new Error('Enrolment not found');
  return enrolment;
}

async function updateEnrolment(id, userId, role, updateData) {
  const enrolment = await getEnrolment(id);
  
  // Check permissions
  if (role !== 'ADMIN' && enrolment.userId !== userId) {
    throw new Error('Access denied');
  }
  
  return await enrolmentModel.updateEnrolment(id, updateData);
}

async function deleteEnrolment(id, userId, role) {
  const enrolment = await getEnrolment(id);
  
  // Check permissions
  if (role !== 'ADMIN' && enrolment.userId !== userId) {
    throw new Error('Access denied');
  }
  
  return await enrolmentModel.deleteEnrolment(id);
}

async function getUserEnrolments(userId, page = 1, limit = 10) {
  return await getAllEnrolments({ userId }, page, limit);
}

async function getSessionEnrolments(sessionId, page = 1, limit = 10) {
  return await getAllEnrolments({ sessionId }, page, limit);
}

module.exports = {
  createEnrolment,
  getAllEnrolments,
  getEnrolment,
  updateEnrolment,
  deleteEnrolment,
  getUserEnrolments,
  getSessionEnrolments
};