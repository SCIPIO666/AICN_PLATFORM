const adminService = require('./adminService');
const logger = require('../../utils/logger');

/**
 * GET /api/admin/stats - ADMIN only
 */
const getStats = async (req, res, next) => {
  try {
    const stats = await adminService.getStats(req.user.id, req.user.role);
    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (err) {
    logger.error(`Failed to get stats: ${err.message}`);
    next(err);
  }
};

/**
 * GET /api/admin/users - ADMIN only
 * ?role=LEARNER|TRAINER|ADMIN&search=&page=&limit=
 */
const getAllUsers = async (req, res, next) => {
  try {
    const filters = {};
    if (req.query.role) filters.role = req.query.role;
    if (req.query.search) filters.search = req.query.search;
    
    const result = await adminService.getAllUsers(
      filters,
      req.query.page,
      req.query.limit,
      req.user.id,
      req.user.role
    );
    
    res.status(200).json({
      success: true,
      ...result
    });
  } catch (err) {
    logger.error(`Failed to get users: ${err.message}`);
    next(err);
  }
};

/**
 * PATCH /api/admin/users/:userId/role - ADMIN only
 * Body: { role: "LEARNER|TRAINER|ADMIN" }
 */
const updateUserRole = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;
    
    const updated = await adminService.updateUserRole(
      userId,
      role,
      req.user.id,
      req.user.role
    );
    
    res.status(200).json({
      success: true,
      message: 'User role updated successfully',
      data: updated
    });
  } catch (err) {
    logger.error(`Failed to update user role: ${err.message}`);
    next(err);
  }
};

/**
 * POST /api/admin/announcements - ADMIN only
 */
const createAnnouncement = async (req, res, next) => {
  try {
    const announcement = await adminService.createAnnouncement(
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
};

/**
 * GET /api/admin/announcements - ADMIN only
 */
const getAllAnnouncements = async (req, res, next) => {
  try {
    const filters = {};
    if (req.query.audience) filters.audience = req.query.audience;
    
    const result = await adminService.getAllAnnouncements(
      filters,
      req.query.page,
      req.query.limit,
      req.user.id,
      req.user.role
    );
    
    res.status(200).json({
      success: true,
      ...result
    });
  } catch (err) {
    logger.error(`Failed to get announcements: ${err.message}`);
    next(err);
  }
};

/**
 * PUT /api/admin/announcements/:id - ADMIN only
 */
const updateAnnouncement = async (req, res, next) => {
  try {
    const updated = await adminService.updateAnnouncement(
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
};

/**
 * DELETE /api/admin/announcements/:id - ADMIN only
 */
const deleteAnnouncement = async (req, res, next) => {
  try {
    await adminService.deleteAnnouncement(
      req.params.id,
      req.user.id,
      req.user.role
    );
    
    res.status(200).json({
      success: true,
      message: 'Announcement deleted successfully'
    });
  } catch (err) {
    logger.error(`Failed to delete announcement: ${err.message}`);
    next(err);
  }
};

module.exports = {
  getStats,
  getAllUsers,
  updateUserRole,
  createAnnouncement,
  getAllAnnouncements,
  updateAnnouncement,
  deleteAnnouncement
};