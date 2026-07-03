
const enrolmentModel = require('./enrolmentsModel');
const { getSession } = require('../sessions/sessionsModel');
const logger = require('../../utils/logger');
const {
  sendEnrolmentConfirmationEmail,
  sendEnrolmentCancellationEmail
} = require('../../utils/email/emailServices/aicnEmailsService');

const {prisma }= require('../../config/db');
const {updateEnrolment}=require('./enrolmentsModel')
const { NotFoundError, BusinessLogicError, AuthorizationError } = require('../../utils/errors/customErrors');

async function createEnrolment(userId, sessionId) {
  const session = await getSession(sessionId);
  if (!session) throw new NotFoundError('Session');
  if (session.status !== 'SCHEDULED') throw new BusinessLogicError('Session is not available for enrolment');
  //if (session.status === 'CANCELLED') throw new BusinessLogicError('Session has been cancelled');
  
  const enrolmentCount = session._count?.enrolments || session.enrolments?.length || 0;
  if (enrolmentCount >= session.capacity) {
    throw new BusinessLogicError('Session has reached maximum capacity');
  }
  
  const existingEnrolment = await enrolmentModel.findEnrolmentByUserAndSession(userId, sessionId);
  if (existingEnrolment) {
     if (existingEnrolment.status === 'CANCELLED') {
      const reactivated = await updateEnrolment(
        existingEnrolment.id, 
        { status: 'ENROLLED', cancellationReason: null }
      )
      logger.info(`User ${userId} re-enrolled in session ${sessionId}`)
      return reactivated
    }
    // Active enrolment → block
    throw new BusinessLogicError('Already enrolled in this session')

  }
  
  //first time enrollment
  const enrolment = await enrolmentModel.createEnrolment({ userId, sessionId, status: 'ENROLLED' });
  
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { email: true, name: true } });
  
  if (user) {
    const sessionDate = session.date || session.startDate;
    const sessionTime = session.time || `${session.startTime} - ${session.endTime}`;
    const location = session.location || session.meetingLink || 'Virtual (Link will be sent)';
    const duration = session.durationMins || session.duration || 120;
    const trainerName = session.trainer?.name || 'AICN Training Faculty';
    
    sendEnrolmentConfirmationEmail({
      to: user.email, name: user.name, sessionTitle: session.title, sessionDate, sessionTime,
      location, duration, sessionId, trainerName
    }).catch(err => logger.error(`Failed to send enrolment confirmation email: ${err.message}`));
  }
  
  logger.info(`User ${userId} enrolled in session ${sessionId}`);
  return enrolment;
}

async function getUserEnrolments(userId, filters = {}, page = 1, limit = 10) {
  const filtersWithUser = { ...filters, userId };
  const skip = (page - 1) * limit;
  const { enrolments, total } = await enrolmentModel.getAllEnrolments(filtersWithUser, skip, limit);
  
  return {
    enrolments,
    total,
    totalPages: Math.ceil(total / limit),
    hasNextPage: page < Math.ceil(total / limit),
    hasPrevPage: page > 1
  };
}

async function markAttendance(enrolmentId, status, userId, role) {
  if (role !== 'ADMIN' && role !== 'TRAINER') {
    throw new AuthorizationError('Only trainers and administrators can mark attendance');
  }
  
  const enrolment = await enrolmentModel.getEnrolmentById(enrolmentId);
  if (!enrolment) throw new NotFoundError('Enrolment');
  
  if (enrolment.status === 'CANCELLED') {
    throw new BusinessLogicError('Cannot mark attendance for a cancelled enrolment');
  }
  
  if (role === 'TRAINER') {
    const session = await getSession(enrolment.sessionId);
    if (session.trainerId !== userId) {
      throw new AuthorizationError('You are not the trainer for this session');
    }
  }
  
  const updated = await enrolmentModel.updateEnrolment(enrolmentId, { status });
  return updated;
}

async function cancelEnrolment(enrolmentId, userId, role, reason = null) {
  const enrolment = await enrolmentModel.getEnrolmentById(enrolmentId);
  if (!enrolment) throw new NotFoundError('Enrolment');
  
  if (role !== 'ADMIN' && enrolment.userId !== userId) {
    throw new AuthorizationError('You can only cancel your own enrolments');
  }
  
  if (enrolment.status === 'ATTENDED') {
    throw new BusinessLogicError('Cannot cancel enrolment after attendance has been marked');
  }
  
  if (enrolment.status === 'CANCELLED') {
    throw new BusinessLogicError('Enrolment is already cancelled');
  }
  
  const updated = await enrolmentModel.updateEnrolment(enrolmentId, { status: 'CANCELLED', cancellationReason: reason });
  if (updated.user?.email) {
    sendEnrolmentCancellationEmail({
      to: updated.user.email,
      name: updated.user.name,
      sessionTitle: updated.session?.title || 'your session',
      reason,
    }).catch(err => logger.error(`Failed to send enrolment cancellation email: ${err.message}`));
  }
  return updated;
}

module.exports = { createEnrolment, getUserEnrolments, markAttendance, cancelEnrolment };
