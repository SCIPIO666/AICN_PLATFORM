
const sessionModel = require('./sessionsModel');
const { NotFoundError, BusinessLogicError } = require('../../utils/errors/customErrors');
const logger = require('../../utils/logger');
const { sendSessionCancellationEmail } = require('../../utils/email/email services/aicnEmailsService');

async function createSession(data) {
  const newSession = await sessionModel.createSession(data);
  return newSession;
}

async function getSession(id) {
  const session = await sessionModel.getSession(id);
  if (!session) throw new NotFoundError('Session');
  return session;
}

async function getAllSessions(filters = {}) {
  const sessionsData = await sessionModel.getAllSessions(filters);
  return {
    sessions: sessionsData.sessions,
    total: sessionsData.total,
    totalPages: sessionsData.totalPages,
    hasNextPage: filters.page < sessionsData.totalPages,
    hasPrevPage: filters.page > 1
  };
}

async function updateSession(id, data) {
  const session = await sessionModel.getSession(id);
  if (!session) throw new NotFoundError('Session');
  if (session.status === 'CANCELLED') throw new BusinessLogicError('Cannot update a cancelled session');
  
  const updatedSession = await sessionModel.updateSession(id, data);
  return updatedSession;
}

async function deleteSession(id) {
  const deletedSession = await sessionModel.deleteSession(id);
  return deletedSession;
}

async function cancelSession(id) {
  const session = await sessionModel.getSession(id);
  if (!session) throw new NotFoundError('Session');
  if (session.status === 'COMPLETED') throw new BusinessLogicError('Cannot cancel a session that has already been completed');
  if (session.status === 'CANCELLED') throw new BusinessLogicError('Session is already cancelled');
  
  const cancelledSession = await sessionModel.updateSession(id, { status: 'CANCELLED' });
  const recipients = session.enrolments?.filter(enrolment => enrolment.user?.email) || [];

  for (const enrolment of recipients) {
    sendSessionCancellationEmail({
      to: enrolment.user.email,
      name: enrolment.user.name,
      sessionTitle: session.title,
      sessionDate: session.date,
    }).catch(err => logger.error(`Failed to send session cancellation email: ${err.message}`));
  }

  return cancelledSession;
}

module.exports = { createSession, getSession, getAllSessions, updateSession, deleteSession, cancelSession };
