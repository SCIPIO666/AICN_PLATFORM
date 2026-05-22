const announcementsModel = require('./announcementsModel');
const logger = require('../../utils/logger');
const userModel=require('../users/usersModel')
async function createAnnouncement(data,id,role) {
const user=awaitfindUserById(id)
  if (!data.title || !data.body) {
    throw new Error('Title and body are required');
  }
  
  const announcement = await announcementsModel.createAnnouncement(data);
  return announcement;
}

async function getAnnouncementById(id) {
  const announcement = await announcementsModel.getAnnouncementById(id);
  if (!announcement) {
    throw new Error('Announcement not found');
  }
  
  if (announcement.audience !== 'all' && userRole === 'LEARNER' && announcement.audience === 'trainers') {
    throw new Error('Access denied');
  }
  
  return announcement;
}

async function getAllAnnouncements(filters = {}, page = 1, limit = 10, userRole = 'LEARNER') {
  const skip = (page - 1) * limit;
  
  // audience based
  if (userRole === 'LEARNER') {
    filters.audience = 'all'; //  all tagged  announcements for learners
  }
  // ADMIN and TRAINER can see all types of  announcements
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

async function updateAnnouncement(id, data, role) {
  if (role !== 'ADMIN') {
    throw new Error('Only admin can update announcements');
  }
  
  const announcement = await announcementsModel.getAnnouncementById(id);
  if (!announcement) {
    throw new Error('Announcement not found');
  }
  
  const updated = await announcementsModel.updateAnnouncement(id, data);
  return updated;
}

async function deleteAnnouncement(id, role) {
  if (role !== 'ADMIN') {
    throw new Error('Only admin can delete announcements');
  }
  
  const announcement = await announcementsModel.getAnnouncementById(id);
  if (!announcement) {
    throw new Error('Announcement not found');
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