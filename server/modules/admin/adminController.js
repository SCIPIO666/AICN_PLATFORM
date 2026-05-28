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
   
    const { role, search, page, limit } = req.query;
    
   
    const filters = {};
    if (role) filters.role = role;
    if (search) filters.search = search;
    
    
    const skip = (page - 1) * limit;
    
    const result = await adminService.getAllUsers(
      filters,
      skip,           
      limit,          
      req.user.id,    
      req.user.role   
    );
    
   
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


const updateUserRoleController = async (req, res, next) => {
  try {
  
    const { userId } = req.params;      
    const { newRole, approvalMessage, rejectionReason, isRejection } = req.body;
    
    const updatedUser = await adminService.updateUserRole(
      userId, 
      newRole, 
      req.user.id, 
      req.user.role,
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
};

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

const getAllAnnouncements = async (req, res, next) => {
  try {

    const { audience, page, limit } = req.query;
    
    const filters = {};
    if (audience) filters.audience = audience;
    
    const result = await adminService.getAllAnnouncements(
      filters,
      page,   
      limit,  
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

const updateAnnouncement = async (req, res, next) => {
  try {

    const { id } = req.params;  
    const updateData = req.body; 
    
    const updated = await adminService.updateAnnouncement(
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
};

const deleteAnnouncement = async (req, res, next) => {
  try {
    const { id } = req.params;  
    
    await adminService.deleteAnnouncement(
      id,
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
  updateUserRoleController, 
  createAnnouncement,
  getAllAnnouncements,
  updateAnnouncement,
  deleteAnnouncement
};