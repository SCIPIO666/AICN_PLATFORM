// admin/adminService.js
const adminModel = require('./adminModel');
const usersModel=require('../users/usersModel')
const announcementsModel = require('../announcements/announcementsModel');
const { sendTrainerApprovalEmail } = require('../../utils/email/emailServices/aicnEmailsService');
const { AuthorizationError, NotFoundError, BusinessLogicError } = require('../../utils/errors/customErrors');
const logger = require('../../utils/logger');

async function getStats(adminId, role) {
  if (role !== 'ADMIN') {
    throw new AuthorizationError('Only administrators can access statistics');
  }
  return await adminModel.getStats();
}

async function getAllUsers(filters = {}, page = 1, limit = 10, adminId, role) {
  if (role !== 'ADMIN') {
    throw new AuthorizationError('Only administrators can view all users');
  }
  
  const skip = (page - 1) * limit;
  const { users, total } = await adminModel.getAllUsers(filters, skip, limit);
  
  return {
    data: users,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
}

async function updateUserRole(userId, newRole, adminId, role, options = {}) {
  if (role !== 'ADMIN') {
    throw new AuthorizationError('Only administrators can update user roles');
  }
  
  const validRoles = ['LEARNER', 'TRAINER', 'ADMIN'];
  if (!validRoles.includes(newRole)) {
    throw new BusinessLogicError(`Invalid role. Valid roles: ${validRoles.join(', ')}`);
  }
  
  const user = await usersModel.findUserById(userId);
  if (!user) {
    throw new NotFoundError('User');
  }
  
  if (user.role === newRole) {
    throw new BusinessLogicError(`User already has the ${newRole} role`);
  }
  
  const updatedUser = await adminModel.updateUserRole(userId, newRole);
  
  if (newRole === 'TRAINER' && user.email) {
    sendTrainerApprovalEmail({
      to: user.email,
      name: user.name || 'Trainer',
      approved: true,
      reason: options.approvalMessage || null,
      trainerId: userId
    }).catch(err => logger.error('Failed to send trainer approval email:', err));
  }
  
  if (options.isRejection === true && user.email) {
    sendTrainerApprovalEmail({
      to: user.email,
      name: user.name || 'User',
      approved: false,
      reason: options.rejectionReason || 'Your trainer application was not approved at this time.',
      trainerId: userId
    }).catch(err => logger.error('Failed to send rejection email:', err));
  }
  
  return updatedUser;
}

async function createAnnouncement(data, adminId, role) {
  if (role !== 'ADMIN') {
    throw new AuthorizationError('Only administrators can create announcements');
  }
  return await announcementsModel.createAnnouncement(data);
}

async function getAllAnnouncements(filters = {}, page = 1, limit = 10, adminId, role) {
  if (role !== 'ADMIN') {
    throw new AuthorizationError('Only administrators can view all announcements');
  }
  
  const skip = (page - 1) * limit;
  const { announcements, total } = await announcementsModel.getAllAnnouncements(filters, skip, limit);
  
  return {
    data: announcements,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
}

async function updateAnnouncement(id, data, adminId, role) {
  if (role !== 'ADMIN') {
    throw new AuthorizationError('Only administrators can update announcements');
  }
  
  logger.info(`Admin ${adminId} updated announcement ${id}`);
  
  return await announcementsModel.updateAnnouncement(id, data);
}

async function deleteAnnouncement(id, adminId, role) {
  if (role !== 'ADMIN') {
    throw new AuthorizationError('Only administrators can delete announcements');
  }
  
  logger.info(`Admin ${adminId} deleted announcement ${id}`);
  
  return await announcementsModel.deleteAnnouncement(id);
}
module.exports = {
  getStats,
  getAllUsers,
  updateUserRole,
  createAnnouncement,
  getAllAnnouncements,
  updateAnnouncement,
  deleteAnnouncement
};