
const announcementsModel = require('./announcementsModel');
const { NotFoundError, AuthorizationError, BusinessLogicError } = require('../../utils/errors/customErrors');
const logger = require('../../utils/logger');

async function createAnnouncement(data, userId, role) {
  if (!data.title || !data.body) {
    throw new BusinessLogicError('Title and body are required');
  }
  
  const announcement = await announcementsModel.createAnnouncement(data);
  return announcement;
}

async function getAnnouncementById(id, userRole = 'LEARNER') {
  const announcement = await announcementsModel.getAnnouncementById(id);
  if (!announcement) {
    throw new NotFoundError('Announcement');
  }
  
  if (announcement.audience !== 'all' && userRole === 'LEARNER' && announcement.audience === 'trainers') {
    throw new AuthorizationError('Access denied to this announcement');
  }
  
  return announcement;
}

async function getAllAnnouncements(filters = {}, page = 1, limit = 10, userRole = 'LEARNER') {
  const skip = (page - 1) * limit;
  
  if (userRole === 'LEARNER') {
    filters.audience = 'all';
  }
  
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

async function updateAnnouncement(id, data, userId, role) {
  if (role !== 'ADMIN') {
    throw new AuthorizationError('Only administrators can update announcements');
  }
  
  const announcement = await announcementsModel.getAnnouncementById(id);
  if (!announcement) {
    throw new NotFoundError('Announcement');
  }
  
  const updated = await announcementsModel.updateAnnouncement(id, data);
  return updated;
}

async function deleteAnnouncement(id, userId, role) {
  if (role !== 'ADMIN') {
    throw new AuthorizationError('Only administrators can delete announcements');
  }
  
  const announcement = await announcementsModel.getAnnouncementById(id);
  if (!announcement) {
    throw new NotFoundError('Announcement');
  }
  
  await announcementsModel.deleteAnnouncement(id);
  return { message: 'Announcement deleted successfully' };
}

module.exports = {
  createAnnouncement,
  getAnnouncementById,
  getAllAnnouncements,
  updateAnnouncement,
  deleteAnnouncement
};