const sessionModel = require('./sessionsModel');

async function createSession(data) {
  const newSession = await sessionModel.createSession(data);
  return newSession;
}

async function getSession(id) {
  const session = await sessionModel.getSession(id);
  return session;
}

async function getAllSessions(filters = {}) {
  const sessionsData = await sessionModel.getAllSessions(filters);
  return sessionsData;
}

async function updateSession(id, data) {
  const updatedSession = await sessionModel.updateSession(id, data);
  return updatedSession;
}

async function deleteSession(id) {
  const deletedSession = await sessionModel.deleteSession(id);
  return deletedSession;
}
// Add this function to existing sessionsService.js
async function cancelSession(id) {
  // Check if session exists
  const session = await sessionModel.getSession(id);
  if (!session) throw new Error('Session not found');
  
  // Soft delete - update status to CANCELLED
  const cancelledSession = await sessionModel.updateSession(id, { 
    status: 'CANCELLED' 
  });
  
  return cancelledSession;
}

module.exports = {
  createSession,
  getSession,
  getAllSessions,
  updateSession,
  deleteSession, 
  cancelSession 
};
