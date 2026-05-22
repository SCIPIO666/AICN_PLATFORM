const enrolmentModel = require('./enrolmentsModel');
const { getSession } = require('../sessions/sessionsModel');
const logger = require('../../utils/logger');
// const { sendEnrolmentConfirmation } = require('../../utils/email/emailService');

async function createEnrolment(userId, sessionId) {
  const session = await getSession(sessionId);
  if (!session) throw new Error('Session not found');
  if (session.status !== 'SCHEDULED') throw new Error('Session is not available for enrolment');
  if (session.status === 'CANCELLED') throw new Error('Session has been cancelled');
  

  const enrolmentCount = session._count?.enrolments || session.enrolments?.length || 0;
  if (enrolmentCount >= session.capacity) {
    throw new Error('Session is at full capacity');
  }
  
  const existingEnrolment = await enrolmentModel.findEnrolmentByUserAndSession(userId, sessionId);
  if (existingEnrolment) {
    throw new Error('Already enrolled in this session');
  }
  
  const enrolment = await enrolmentModel.createEnrolment({ userId, sessionId, status: 'ENROLLED' });
  
  //  user email for confirmation
  const user = await prisma.user.findUnique({ where: { id: userId } });
  
  // confirmation email 
  // sendEnrolmentConfirmation(user.email, user.name, session).catch(err =>
  //   logger.error(`Failed to send enrolment confirmation: ${err.message}`)
  // );
  
  return enrolment;
}

async function getUserEnrolments(userId, filters = {}, page = 1, limit = 10) {
  const filtersWithUser = { ...filters, userId };
  const skip = (page - 1) * limit;
  const { enrolments, total } = await enrolmentModel.getAllEnrolments(filtersWithUser, skip, limit);
  
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

async function markAttendance(enrolmentId, status, userId, role) {
  //  TRAINER or ADMIN only
  if (role !== 'ADMIN' && role !== 'TRAINER') {
    throw new Error('Only trainers and admins can mark attendance');
  }
  
  const enrolment = await enrolmentModel.getEnrolmentById(enrolmentId);
  if (!enrolment) throw new Error('Enrolment not found');
  
  // Verifying trainer 
  if (role === 'TRAINER') {
    const session = await getSession(enrolment.sessionId);
    if (session.trainerId !== userId) {
      throw new Error('You are not the trainer for this session');
    }
  }
  
  const updated = await enrolmentModel.updateEnrolment(enrolmentId, { status });
  return updated;
}

async function cancelEnrolment(enrolmentId, userId, role) {
  const enrolment = await enrolmentModel.getEnrolmentById(enrolmentId);
  if (!enrolment) throw new Error('Enrolment not found');
  
  //user and ADMIN owns enrolment 
  if (role !== 'ADMIN' && enrolment.userId !== userId) {
    throw new Error('You can only cancel your own enrolments');
  }
  
  //  already ATTENDED or ABSENT
  if (enrolment.status === 'ATTENDED') {
    throw new Error('Cannot cancel enrolment after attendance has been marked');
  }
  
  const updated = await enrolmentModel.updateEnrolment(enrolmentId, { status: 'CANCELLED' });
  return updated;
}

module.exports = {
  createEnrolment,
  getUserEnrolments,
  markAttendance,
  cancelEnrolment
};