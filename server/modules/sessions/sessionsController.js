const sessionsService = require('./sessionsService');
const logger = require('../../utils/logger');


const getAllSessions = async (req, res, next) => {
  try {
    const filters = { ...req.query };


    if (filters.upcoming === 'true') {
      filters.fromDate = new Date().toISOString();
      delete filters.upcoming;
    }

    const sessions = await sessionsService.getAllSessions(filters);
    res.status(200).json({
      success: true,
      data: sessions
    });
  } catch (err) {
    logger.error(`Failed to fetch sessions: ${err.message}`);
    next(err);
  }
};


const getSession = async (req, res, next) => {
  try {
    const id = req.params.id;
    const session = await sessionsService.getSession(id);
    res.status(200).json({
      success: true,
      data: session
    });
  } catch (err) {
    logger.error(`Failed to fetch session ${id}: ${err.message}`);
    next(err);
  }
};


const createSession = async (req, res, next) => {
  try {
    const sessionData = req.body;
    const session = await sessionsService.createSession(sessionData);
    res.status(201).json({
      success: true,
      data: session
    });
  } catch (err) {
    logger.error(`Failed to create session: ${err.message}`);
    next(err);
  }
};


const updateSession = async (req, res, next) => {
  try {
    const id = req.params.id;
    const updateData = req.body;
    const session = await sessionsService.updateSession(id, updateData);
    res.status(200).json({
      success: true,
      data: session
    });
  } catch (err) {
    logger.error(`Failed to update session ${req.params.id}: ${err.message}`);
    next(err);
  }
};


const deleteSession = async (req, res, next) => {
  try {
    const id = req.params.id;
    // Soft delete - seting to CANCELLED 
    const cancelledSession = await sessionsService.cancelSession(id);
    res.status(200).json({
      success: true,
      message: 'Session cancelled successfully',
      data: cancelledSession
    });
  } catch (err) {
    logger.error(`Failed to cancel session ${req.params.id}: ${err.message}`);
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