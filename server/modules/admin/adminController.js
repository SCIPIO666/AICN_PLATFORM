const adminService = require('./adminService');
const logger = require('../../utils/logger');

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

const getAllUsers = async (req, res, next) => {
  try {
    const filters = {};
    if (req.query.role) filters.role = req.query.role;
    if (req.query.search) filters.search = req.query.search;
    
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const result = await adminService.getAllUsers(
      filters,
      skip,           
      limit,         
      req.user.id,    
      req.user.role   
    );
    
    // Calculate pagination metadata
    const totalPages = Math.ceil(result.total / limit);
    
    res.status(200).json({
      success: true,
      data: result.users,
      pagination: {
        page: page,
        limit: limit,
        total: result.total,
        totalPages: totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (err) {
    logger.error(`Failed to get users: ${err.message}`);
    next(err);
  }
};

async function updateUserRoleController(req, res) {
  try {
    const { userId, newRole } = req.params || req.body;
    const adminId = req.user?.id; 
    const adminRole = req.user?.role;
    const { approvalMessage, rejectionReason, isRejection } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    if (!newRole) {
      return res.status(400).json({
        success: false,
        message: 'New role is required'
      });
    }
    const updatedUser = await adminRole.updateUserRole(
      userId, 
      newRole, 
      adminId, 
      adminRole,
      {
        approvalMessage,
        rejectionReason,
        isRejection: isRejection || false
      }
    );

    return res.status(200).json({
      success: true,
      message: `User role updated to ${newRole} successfully`,
      data: {
        userId: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        role: updatedUser.role,
        updatedAt: updatedUser.updated_at
      }
    });

  } catch (error) {
    logger.error('Error in updateUserRoleController:', error);
    
    // Handle specific errors
    if (error.message === 'Access denied') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only admins can update roles.'
      });
    }
    
    if (error.message === 'Invalid role') {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Valid roles: LEARNER, TRAINER, ADMIN'
      });
    }
    
    if (error.message === 'User not found') {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    if (error.message.includes('already has the')) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'Failed to update user role',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

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