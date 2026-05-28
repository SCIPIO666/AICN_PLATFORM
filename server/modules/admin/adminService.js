const adminModel = require('./adminModel');
const announcementsModel = require('../announcements/announcementsModel');
const {sendTrainerApprovalEmail}=require('../../utils/email/email services/aicnEmailsService')

async function getStats(adminId, role) {
  if (role !== 'ADMIN') throw new Error('Access denied');
  return await adminModel.getStats();
}

async function getAllUsers(filters = {}, page = 1, limit = 10, adminId, role) {
  if (role !== 'ADMIN') throw new Error('Access denied');
  
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
  if (role !== 'ADMIN') throw new Error('Access denied');
  
  const validRoles = ['LEARNER', 'TRAINER', 'ADMIN'];
  if (!validRoles.includes(newRole)) {
    throw new Error('Invalid role');
  }
  
  // Get user details before updating
  const user = await adminModel.getUserById(userId);
  if (!user) {
    throw new Error('User not found');
  }
  
  // Check if role is actually changing
  if (user.role === newRole) {
    throw new Error(`User already has the ${newRole} role`);
  }
  
  // Update the user role
  const updatedUser = await adminModel.updateUserRole(userId, newRole);
  
  // Send email notification for trainer role changes
  if (newRole === 'TRAINER' && user.email) {
    try {
      await sendTrainerApprovalEmail({
        to: user.email,
        name: user.name || user.fullName || 'Trainer',
        approved: true,
        reason: options.approvalMessage || null,
        trainerId: userId
      });
    } catch (emailError) {
      console.error('Failed to send trainer approval email:', emailError);
      // Don't throw - email failure shouldn't block role update
    }
  }
  
  // ejection email 
  if (options.isRejection === true && user.email) {
    try {
      await sendTrainerApprovalEmail({
        to: user.email,
        name: user.name || user.fullName || 'User',
        approved: false,
        reason: options.rejectionReason || 'Your trainer application was not approved at this time.',
        trainerId: userId
      });
    } catch (emailError) {
      console.error('Failed to send rejection email:', emailError);
    }
  }

  
  return updatedUser;
}


async function createAnnouncement(data, adminId, role) {
  if (role !== 'ADMIN') throw new Error('Access denied');
  return await announcementsModel.createAnnouncement(data);
}

async function getAllAnnouncements(filters = {}, page = 1, limit = 10, adminId, role) {
  if (role !== 'ADMIN') throw new Error('Access denied');
  
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
  if (role !== 'ADMIN') throw new Error('Access denied');
  return await announcementsModel.updateAnnouncement(id, data);
}

async function deleteAnnouncement(id, adminId, role) {
  if (role !== 'ADMIN') throw new Error('Access denied');
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