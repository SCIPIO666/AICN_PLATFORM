const {prisma } = require('../../config/db');
const logger = require('../../utils/logger');

async function createAnnouncement(data) {
  try {
    return await prisma.announcement.create({
      data: {
        title: data.title,
        body: data.body,
        audience: data.audience || 'all'
      }
    });
  } catch (error) {
    logger.error(`Failed to create announcement: ${error.message}`);
    throw error;
  }
}

async function getAnnouncementById(id) {
  try {
    return await prisma.announcement.findUnique({
      where: { id }
    });
  } catch (error) {
    logger.error(`Failed to get announcement by ID: ${error.message}`);
    throw error;
  }
}

async function getAllAnnouncements(filters = {}, skip = 0, take = 10) {
  try {
    const where = {};
    
    if (filters.audience && filters.audience !== 'all') {
      where.audience = {
        in: [filters.audience, 'all']
      };
    }
    
    if (filters.fromDate) {
      where.createdAt = { gte: new Date(filters.fromDate) };
    }
    
    if (filters.toDate) {
      where.createdAt = { ...where.createdAt, lte: new Date(filters.toDate) };
    }
    
    const [announcements, total] = await Promise.all([
      prisma.announcement.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.announcement.count({ where })
    ]);
    
    return { announcements, total };
  } catch (error) {
    logger.error(`Failed to get all announcements: ${error.message}`);
    throw error;
  }
}

async function updateAnnouncement(id, data) {
  try {
    return await prisma.announcement.update({
      where: { id },
      data: {
        title: data.title,
        body: data.body,
        audience: data.audience
      }
    });
  } catch (error) {
    logger.error(`Failed to update announcement: ${error.message}`);
    throw error;
  }
}

async function deleteAnnouncement(id) {
  try {
    return await prisma.announcement.delete({
      where: { id }
    });
  } catch (error) {
    logger.error(`Failed to delete announcement: ${error.message}`);
    throw error;
  }
}

module.exports = {
  createAnnouncement,
  getAnnouncementById,
  getAllAnnouncements,
  updateAnnouncement,
  deleteAnnouncement
};