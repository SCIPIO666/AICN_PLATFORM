const trainersService = require('./trainersService');
const logger = require('../../utils/logger');

/**
 * Apply to become a trainer
 * POST /api/trainers/apply
 */
async function applyForTrainer(req, res, next) {
  try {
    const applicationData = req.body;
    
    const result = await trainersService.applyForTrainer(req.user.id, applicationData);
    
    res.status(201).json({
      success: true,
      message: 'Trainer application submitted successfully',
      data: result
    });
  } catch (err) {
    logger.error(`Failed to submit trainer application: ${err.message}`);
    
    if (err.message === 'User already has a trainer profile') {
      return res.status(409).json({
        success: false,
        message: 'You already have a trainer profile'
      });
    }
    
    if (err.message === 'User already has a pending application') {
      return res.status(409).json({
        success: false,
        message: 'You already have a pending trainer application'
      });
    }
    
    next(err);
  }
}

/**
 * Get my trainer profile
 * GET /api/trainers/me
 */
async function getMyTrainerProfile(req, res, next) {
  try {
    const profile = await trainersService.getMyTrainerProfile(req.user.id);
    
    res.status(200).json({
      success: true,
      data: profile
    });
  } catch (err) {
    logger.error(`Failed to get trainer profile: ${err.message}`);
    
    if (err.message === 'Trainer profile not found') {
      return res.status(404).json({
        success: false,
        message: 'Trainer profile not found. Please apply first.'
      });
    }
    
    next(err);
  }
}

/**
 * Update my trainer profile
 * PATCH /api/trainers/me
 */
async function updateMyTrainerProfile(req, res, next) {
  try {

    const updateData = req.body;
    
    const updated = await trainersService.updateMyTrainerProfile(req.user.id, updateData);
    
    res.status(200).json({
      success: true,
      message: 'Trainer profile updated successfully',
      data: updated
    });
  } catch (err) {
    logger.error(`Failed to update trainer profile: ${err.message}`);
    
    if (err.message === 'Trainer profile not found') {
      return res.status(404).json({
        success: false,
        message: 'Trainer profile not found'
      });
    }
    
    next(err);
  }
}

/**
 * Withdraw trainer application
 * DELETE /api/trainers/me
 */
async function withdrawApplication(req, res, next) {
  try {
    const result = await trainersService.withdrawApplication(req.user.id);
    
    res.status(200).json({
      success: true,
      message: result.message || 'Application withdrawn successfully'
    });
  } catch (err) {
    logger.error(`Failed to withdraw application: ${err.message}`);
    
    if (err.message === 'No pending application found') {
      return res.status(404).json({
        success: false,
        message: 'No pending application found to withdraw'
      });
    }
    
    next(err);
  }
}

/**
 * Get all trainer applications (Admin only)
 * GET /api/trainers OR /api/trainers/admin/all
 */
async function getAllTrainerApplications(req, res, next) {
  try {

    const { status, skill, page, limit, search } = req.query;
    
    const filters = {};
    if (status) filters.status = status;
    if (skill) filters.skill = skill;
    if (search) filters.search = search;
    
    const result = await trainersService.getAllTrainerApplications(
      filters,
      page,  
      limit   
    );
    
    res.status(200).json({
      success: true,
      data: result.applications,
      pagination: {
        page: page,
        limit: limit,
        total: result.total,
        totalPages: result.totalPages,
        hasNextPage: result.hasNextPage,
        hasPrevPage: result.hasPrevPage
      }
    });
  } catch (err) {
    logger.error(`Failed to get trainer applications: ${err.message}`);
    next(err);
  }
}

/**
 * Get trainer application by ID (Admin only)
 * GET /api/trainers/admin/:id
 */
async function getTrainerApplicationById(req, res, next) {
  try {

    const { id } = req.params;
    
    const application = await trainersService.getTrainerApplicationById(
      id,
      req.user.id,
      req.user.role
    );
    
    res.status(200).json({
      success: true,
      data: application
    });
  } catch (err) {
    logger.error(`Failed to get trainer application: ${err.message}`);
    
    if (err.message === 'Application not found') {
      return res.status(404).json({
        success: false,
        message: 'Trainer application not found'
      });
    }
    
    next(err);
  }
}

/**
 * Approve trainer application (Admin only)
 * PATCH /api/trainers/admin/:id/approve
 */
async function approveTrainerApplication(req, res, next) {
  try {

    const { id } = req.params;
    

    const { message } = req.body;
    
    const result = await trainersService.approveTrainerApplication(
      id, 
      req.user.id,
      message
    );
    
    res.status(200).json({
      success: true,
      message: 'Trainer application approved successfully',
      data: result
    });
  } catch (err) {
    logger.error(`Failed to approve trainer application: ${err.message}`);
    
    if (err.message === 'Application not found') {
      return res.status(404).json({
        success: false,
        message: 'Trainer application not found'
      });
    }
    
    if (err.message === 'Application already processed') {
      return res.status(400).json({
        success: false,
        message: 'This application has already been processed'
      });
    }
    
    next(err);
  }
}

/**
 * Reject trainer application (Admin only)
 * PATCH /api/trainers/admin/:id/reject
 */
async function rejectTrainerApplication(req, res, next) {
  try {

    const { id } = req.params;
    const { reason, feedback } = req.body;
    
    const result = await trainersService.rejectTrainerApplication(
      id, 
      req.user.id,
      { reason, feedback }
    );
    
    res.status(200).json({
      success: true,
      message: 'Trainer application rejected',
      data: result
    });
  } catch (err) {
    logger.error(`Failed to reject trainer application: ${err.message}`);
    
    if (err.message === 'Application not found') {
      return res.status(404).json({
        success: false,
        message: 'Trainer application not found'
      });
    }
    
    if (err.message === 'Application already processed') {
      return res.status(400).json({
        success: false,
        message: 'This application has already been processed'
      });
    }
    
    next(err);
  }
}

/**
 * Delete trainer application (Admin only)
 * DELETE /api/trainers/admin/:id
 */
async function deleteTrainerApplication(req, res, next) {
  try {

    const { id } = req.params;
    
    const result = await trainersService.deleteTrainerApplication(id, req.user.id);
    
    res.status(200).json({
      success: true,
      message: result.message || 'Application deleted successfully'
    });
  } catch (err) {
    logger.error(`Failed to delete trainer application: ${err.message}`);
    
    if (err.message === 'Application not found') {
      return res.status(404).json({
        success: false,
        message: 'Trainer application not found'
      });
    }
    
    next(err);
  }
}

/**
 * Get trainer's sessions (Trainer/Admin only)
 * GET /api/trainers/me/sessions
 */
const getMySessions = async (req, res, next) => {
  try {

    const { status, fromDate, toDate, page, limit } = req.query;
    
    const filters = {};
    if (status) filters.status = status;
    if (fromDate) filters.fromDate = fromDate;
    if (toDate) filters.toDate = toDate;
    if (page) filters.page = page;
    if (limit) filters.limit = limit;
    
    const result = await trainersService.getTrainerSessions(
      req.user.id,
      req.user.role,
      filters
    );
    
    res.status(200).json({
      success: true,
      data: result.sessions,
      pagination: {
        page: page,
        limit: limit,
        total: result.total,
        totalPages: result.totalPages,
        hasNextPage: result.hasNextPage,
        hasPrevPage: result.hasPrevPage
      }
    });
  } catch (err) {
    logger.error(`Failed to get trainer sessions: ${err.message}`);
    
    if (err.message === 'Trainer profile not found') {
      return res.status(404).json({
        success: false,
        message: 'Trainer profile not found'
      });
    }
    
    next(err);
  }
};
/**
 * Get approved trainers (public info - no sensitive data)
 * GET /api/trainers
 */
async function getApprovedTrainers(req, res, next) {
  try {

    const { skill, page, limit, search } = req.query;
    
    const filters = {};
    if (skill) filters.skill = skill;
    if (search) filters.search = search;
    filters.status = 'APPROVED'; 
    
    const result = await trainersService.getApprovedTrainers(
      filters,
      page,
      limit
    );
    
    // Return only public information
    const publicTrainers = result.trainers.map(trainer => ({
      id: trainer.id,
      name: trainer.user?.name,
      skills: trainer.skills,
      bio: trainer.bio,
      totalSessions: trainer._count?.sessions || 0
    }));
    
    res.status(200).json({
      success: true,
      data: publicTrainers,
      pagination: {
        page: page,
        limit: limit,
        total: result.total,
        totalPages: result.totalPages
      }
    });
  } catch (err) {
    logger.error(`Failed to get approved trainers: ${err.message}`);
    next(err);
  }
}

module.exports = {
  applyForTrainer,
  getMyTrainerProfile,
  updateMyTrainerProfile,
  withdrawApplication,
  getAllTrainerApplications,
  getTrainerApplicationById,
  approveTrainerApplication,
  rejectTrainerApplication,
  deleteTrainerApplication,
  getMySessions,
  getApprovedTrainers  
};
