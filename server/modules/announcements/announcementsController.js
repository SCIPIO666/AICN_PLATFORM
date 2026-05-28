const announcementsService = require('./announcementsService');
const logger = require('../../utils/logger');


//all params queries and bosy data validated by zod schemas and validate middleware
async function createAnnouncement(req, res, next) {
  try {

    const announcement = await announcementsService.createAnnouncement(
      req.body,     
      req.user.id,
      req.user.role
    );
    res.status(201).json({
      success: true,
      message: 'Announcement created successfully',
      data: announcement
    });
  } catch (err) {
    logger.error(`Failed to create announcement: ${err.message}`);
    next(err);
  }
}

async function getAnnouncementById(req, res, next) {
  try {
    const { id } = req.params;
    
    const announcement = await announcementsService.getAnnouncementById(
      id,  
      req.user?.role || 'LEARNER'
    );
    res.status(200).json({
      success: true,
      data: announcement
    });
  } catch (err) {
    logger.error(`Failed to get announcement: ${err.message}`);
    next(err);
  }
}

async function getAllAnnouncements(req, res, next) {
  try {
    const { audience, fromDate, toDate, page, limit } = req.query;
  
    const filters = {};
    if (audience) filters.audience = audience;
    if (fromDate) filters.fromDate = fromDate;
    if (toDate) filters.toDate = toDate;
    
    const result = await announcementsService.getAllAnnouncements(
      filters,
      page,  
      limit,   
      req.user?.role || 'LEARNER'
    );
    
    res.status(200).json({
      success: true,
      ...result
    });
  } catch (err) {
    logger.error(`Failed to get announcements: ${err.message}`);
    next(err);
  }
}

async function updateAnnouncement(req, res, next) {
  try {

    const { id } = req.params;    
    const updateData = req.body;  
    
    const updated = await announcementsService.updateAnnouncement(
      id,
      updateData,
      req.user.id,
      req.user.role
    );
    res.status(200).json({
      success: true,
      message: 'Announcement updated successfully',
      data: updated
    });
  } catch (err) {
    logger.error(`Failed to update announcement: ${err.message}`);
    next(err);
  }
}

async function deleteAnnouncement(req, res, next) {
  try {
    const { id } = req.params;  
    
    const result = await announcementsService.deleteAnnouncement(
      id,
      req.user.id,
      req.user.role
    );
    res.status(200).json({
      success: true,
      message: result.message
    });
  } catch (err) {
    logger.error(`Failed to delete announcement: ${err.message}`);
    next(err);
  }
}

module.exports = {
  createAnnouncement,
  getAnnouncementById,
  getAllAnnouncements,
  updateAnnouncement,
  deleteAnnouncement
};