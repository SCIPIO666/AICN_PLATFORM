const enrolmentsService = require('./enrolmentService');
const logger = require('../../utils/logger');

/**
 * Create a new enrolment
 * POST /api/enrolments
 */
const createEnrolment = async (req, res, next) => {
  try {

    const { sessionId } = req.body;
    const userId = req.user.id;
    
    const enrolment = await enrolmentsService.createEnrolment(userId, sessionId);
    
    res.status(201).json({
      success: true,
      message: 'Successfully enrolled in session',
      data: enrolment
    });
  } catch (err) {
    logger.error(`Failed to create enrolment: ${err.message}`);
    

    if (err.message === 'Session not found') {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }
    
    if (err.message === 'Already enrolled in this session') {
      return res.status(409).json({
        success: false,
        message: 'You are already enrolled in this session'
      });
    }
    
    if (err.message === 'Session is full') {
      return res.status(400).json({
        success: false,
        message: 'This session has reached maximum capacity'
      });
    }
    
    if (err.message === 'Session has already started') {
      return res.status(400).json({
        success: false,
        message: 'Cannot enrol in a session that has already started'
      });
    }
    
    next(err);
  }
};

/**
 * Get my enrolments (for current user)
 * GET /api/enrolments/me
 */
const getMyEnrolments = async (req, res, next) => {
  try {

    const { status, page, limit, fromDate, toDate } = req.query;

    const filters = {};
    if (status) filters.status = status;
    if (fromDate) filters.fromDate = fromDate;
    if (toDate) filters.toDate = toDate;
    
    const result = await enrolmentsService.getUserEnrolments(
      req.user.id,
      filters,
      page,   
      limit   
    );
    
    res.status(200).json({
      success: true,
      data: result.enrolments,
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
    logger.error(`Failed to get my enrolments: ${err.message}`);
    next(err);
  }
};

/**
 * Mark attendance for an enrolment (Trainer/Admin only)
 * PATCH /api/enrolments/:id/attend
 */
const markAttendance = async (req, res, next) => {
  try {

    const { id } = req.params;
    const { status } = req.body; 
    
    const enrolment = await enrolmentsService.markAttendance(
      id,
      status,
      req.user.id,
      req.user.role
    );
    
    res.status(200).json({
      success: true,
      message: `Attendance marked as ${status}`,
      data: enrolment
    });
  } catch (err) {
    logger.error(`Failed to mark attendance: ${err.message}`);
    

    if (err.message === 'Enrolment not found') {
      return res.status(404).json({
        success: false,
        message: 'Enrolment record not found'
      });
    }
    
    if (err.message === 'Cannot mark attendance for cancelled enrolment') {
      return res.status(400).json({
        success: false,
        message: 'Cannot mark attendance for a cancelled enrolment'
      });
    }
    
    if (err.message === 'Session has not started yet') {
      return res.status(400).json({
        success: false,
        message: 'Cannot mark attendance before session starts'
      });
    }
    
    next(err);
  }
};

/**
 * Cancel an enrolment
 * PATCH /api/enrolments/:id/cancel
 */
const cancelEnrolment = async (req, res, next) => {
  try {

    const { id } = req.params;
    const { reason } = req.body;
    
    const enrolment = await enrolmentsService.cancelEnrolment(
      id,
      req.user.id,
      req.user.role,
      reason 
    );
    
    res.status(200).json({
      success: true,
      message: 'Enrolment cancelled successfully',
      data: enrolment
    });
  } catch (err) {
    logger.error(`Failed to cancel enrolment: ${err.message}`);
    

    if (err.message === 'Enrolment not found') {
      return res.status(404).json({
        success: false,
        message: 'Enrolment record not found'
      });
    }
    
    if (err.message === 'Cannot cancel completed session') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel enrolment for a completed session'
      });
    }
    
    if (err.message === 'Enrolment already cancelled') {
      return res.status(400).json({
        success: false,
        message: 'This enrolment is already cancelled'
      });
    }
    
    next(err);
  }
};

module.exports = {
  createEnrolment,
  getMyEnrolments,
  markAttendance,
  cancelEnrolment
};