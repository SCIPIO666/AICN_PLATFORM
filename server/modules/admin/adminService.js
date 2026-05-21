const adminModel = require('./adminModel');
const announcementsModel = require('../announcements/announcementsModel');

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

async function updateUserRole(userId, newRole, adminId, role) {
  if (role !== 'ADMIN') throw new Error('Access denied');
  
  const validRoles = ['LEARNER', 'TRAINER', 'ADMIN'];
  if (!validRoles.includes(newRole)) {
    throw new Error('Invalid role');
  }
  
  return await adminModel.updateUserRole(userId, newRole);
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