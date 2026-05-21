const trainersService = require('./trainersService');
const logger = require('../../utils/logger');

/**
 * Apply to become a trainer
 */
async function applyForTrainer(req, res, next) {
  try {
    const result = await trainersService.applyForTrainer(req.user.id, req.body);
    res.status(201).json({
      success: true,
      message: 'Trainer application submitted successfully',
      data: result
    });
  } catch (err) {
    logger.error(`Failed to submit trainer application: ${err.message}`);
    next(err);
  }
}

/**
 * Get my trainer profile
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
    next(err);
  }
}

/**
 * Update my trainer profile (only if PENDING)
 */
async function updateMyTrainerProfile(req, res, next) {
  try {
    const updated = await trainersService.updateMyTrainerProfile(req.user.id, req.body);
    res.status(200).json({
      success: true,
      message: 'Trainer profile updated successfully',
      data: updated
    });
  } catch (err) {
    logger.error(`Failed to update trainer profile: ${err.message}`);
    next(err);
  }
}

/**
 * Withdraw trainer application
 */
async function withdrawApplication(req, res, next) {
  try {
    const result = await trainersService.withdrawApplication(req.user.id);
    res.status(200).json({
      success: true,
      message: result.message
    });
  } catch (err) {
    logger.error(`Failed to withdraw application: ${err.message}`);
    next(err);
  }
}

/**
 * Get all trainer applications (ADMIN only)
 */
async function getAllTrainerApplications(req, res, next) {
  try {
    const filters = {};
    if (req.query.status) filters.status = req.query.status;
    if (req.query.skill) filters.skill = req.query.skill;
    
    const result = await trainersService.getAllTrainerApplications(
      filters,
      req.query.page,
      req.query.limit
    );
    
    res.status(200).json({
      success: true,
      ...result
    });
  } catch (err) {
    logger.error(`Failed to get trainer applications: ${err.message}`);
    next(err);
  }
}

/**
 * Get trainer application by ID (ADMIN only)
 */
async function getTrainerApplicationById(req, res, next) {
  try {
    const application = await trainersService.getTrainerApplicationById(
      req.params.id,
      req.user.id,
      req.user.role
    );
    res.status(200).json({
      success: true,
      data: application
    });
  } catch (err) {
    logger.error(`Failed to get trainer application: ${err.message}`);
    next(err);
  }
}

/**
 * Approve trainer application (ADMIN only)
 */
async function approveTrainerApplication(req, res, next) {
  try {
    const result = await trainersService.approveTrainerApplication(req.params.id, req.user.id);
    res.status(200).json({
      success: true,
      message: 'Trainer application approved successfully',
      data: result
    });
  } catch (err) {
    logger.error(`Failed to approve trainer application: ${err.message}`);
    next(err);
  }
}

/**
 * Reject trainer application (ADMIN only)
 */
async function rejectTrainerApplication(req, res, next) {
  try {
    const result = await trainersService.rejectTrainerApplication(req.params.id, req.user.id);
    res.status(200).json({
      success: true,
      message: 'Trainer application rejected',
      data: result
    });
  } catch (err) {
    logger.error(`Failed to reject trainer application: ${err.message}`);
    next(err);
  }
}

/**
 * Delete trainer application (ADMIN only)
 */
async function deleteTrainerApplication(req, res, next) {
  try {
    const result = await trainersService.deleteTrainerApplication(req.params.id, req.user.id);
    res.status(200).json({
      success: true,
      message: result.message
    });
  } catch (err) {
    logger.error(`Failed to delete trainer application: ${err.message}`);
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
  deleteTrainerApplication
};