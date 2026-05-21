const announcementsService = require('./announcementsService');
const logger = require('../../utils/logger');

/**
 * Create announcement (ADMIN only)
 */
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

/**
 * Get announcement by ID (PUBLIC with audience filter)
 */
async function getAnnouncementById(req, res, next) {
  try {
    const announcement = await announcementsService.getAnnouncementById(
      req.params.id,
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

/**
 * Get all announcements (PUBLIC with filters)
 */
async function getAllAnnouncements(req, res, next) {
  try {
    const filters = {};
    if (req.query.audience) filters.audience = req.query.audience;
    if (req.query.fromDate) filters.fromDate = req.query.fromDate;
    if (req.query.toDate) filters.toDate = req.query.toDate;
    
    const result = await announcementsService.getAllAnnouncements(
      filters,
      req.query.page,
      req.query.limit,
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

/**
 * Update announcement (ADMIN only)
 */
async function updateAnnouncement(req, res, next) {
  try {
    const updated = await announcementsService.updateAnnouncement(
      req.params.id,
      req.body,
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

/**
 * Delete announcement (ADMIN only)
 */
async function deleteAnnouncement(req, res, next) {
  try {
    const result = await announcementsService.deleteAnnouncement(
      req.params.id,
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