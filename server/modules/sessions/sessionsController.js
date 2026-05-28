const sessionsService = require('./sessionsService');
const logger = require('../../utils/logger');

/**
 * Get all sessions with filters
 * GET /api/sessions
 */
const getAllSessions = async (req, res, next) => {
  try {

    let { status, skillArea, locationType, county, trainerId, fromDate, toDate, upcoming, page, limit } = req.query;
    

    const filters = {};
    if (status) filters.status = status;
    if (skillArea) filters.skillArea = skillArea;
    if (locationType) filters.locationType = locationType;
    if (county) filters.county = county;
    if (trainerId) filters.trainerId = trainerId;
    if (fromDate) filters.fromDate = fromDate;
    if (toDate) filters.toDate = toDate;
    

    if (upcoming === 'true') {
      filters.fromDate = new Date().toISOString();
    }
    
    // pagination
    filters.page = page;
    filters.limit = limit;
    
    const result = await sessionsService.getAllSessions(filters);
    
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
    logger.error(`Failed to fetch sessions: ${err.message}`);
    next(err);
  }
};

/**
 * Get single session by ID
 * GET /api/sessions/:id
 */
const getSession = async (req, res, next) => {
  try {

    const { id } = req.params;
    
    const session = await sessionsService.getSession(id);
    
    res.status(200).json({
      success: true,
      data: session
    });
  } catch (err) {
    logger.error(`Failed to fetch session ${req.params.id}: ${err.message}`);
    
    if (err.message === 'Session not found') {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }
    
    next(err);
  }
};

/**
 * Create new session (Admin only)
 * POST /api/sessions
 */
const createSession = async (req, res, next) => {
  try {

    const sessionData = req.body;
    
    const session = await sessionsService.createSession(sessionData);
    
    res.status(201).json({
      success: true,
      message: 'Session created successfully',
      data: session
    });
  } catch (err) {
    logger.error(`Failed to create session: ${err.message}`);
    
    // Handle specific business errors
    if (err.message === 'Trainer not found') {
      return res.status(404).json({
        success: false,
        message: 'Assigned trainer not found'
      });
    }
    
    if (err.message === 'Trainer already has a session at this time') {
      return res.status(409).json({
        success: false,
        message: 'Trainer is already assigned to another session at this time'
      });
    }
    
    if (err.message === 'Venue already booked at this time') {
      return res.status(409).json({
        success: false,
        message: 'Venue is already booked for another session at this time'
      });
    }
    
    next(err);
  }
};

/**
 * Update session (Admin only)
 * PUT /api/sessions/:id
 */
const updateSession = async (req, res, next) => {
  try {

    const { id } = req.params;
    const updateData = req.body;
    
    const session = await sessionsService.updateSession(id, updateData);
    
    res.status(200).json({
      success: true,
      message: 'Session updated successfully',
      data: session
    });
  } catch (err) {
    logger.error(`Failed to update session ${req.params.id}: ${err.message}`);
    
    if (err.message === 'Session not found') {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }
    
    if (err.message === 'Cannot update cancelled session') {
      return res.status(400).json({
        success: false,
        message: 'Cannot update a cancelled session'
      });
    }
    
    if (err.message === 'Cannot update session that has already started') {
      return res.status(400).json({
        success: false,
        message: 'Cannot update a session that has already started'
      });
    }
    
    next(err);
  }
};

/**
 * Delete/Cancel session (Admin only)
 * DELETE /api/sessions/:id
 */
const deleteSession = async (req, res, next) => {
  try {

    const { id } = req.params;
    
    // Soft delete - set status to CANCELLED
    const cancelledSession = await sessionsService.cancelSession(id);
    
    res.status(200).json({
      success: true,
      message: 'Session cancelled successfully',
      data: cancelledSession
    });
  } catch (err) {
    logger.error(`Failed to cancel session ${req.params.id}: ${err.message}`);
    
    if (err.message === 'Session not found') {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }
    
    if (err.message === 'Cannot cancel completed session') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel a session that has already been completed'
      });
    }
    
    if (err.message === 'Session already cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Session is already cancelled'
      });
    }
    
    next(err);
  }
};

module.exports = {
  getAllSessions,
  getSession,
  createSession,
  updateSession,
  deleteSession
};