const enrolmentsService = require('./enrolmentsService');
const logger = require('../../utils/logger');

const createEnrolment = async (req, res, next) => {
  try {
    const { sessionId } = req.body;
    const enrolment = await enrolmentsService.createEnrolment(req.user.id, sessionId);
    res.status(201).json({
      success: true,
      message: 'Successfully enrolled in session',
      data: enrolment
    });
  } catch (err) {
    logger.error(`Failed to create enrolment: ${err.message}`);
    next(err);
  }
};


const getMyEnrolments = async (req, res, next) => {
  try {
    const filters = { ...req.query };
    const result = await enrolmentsService.getUserEnrolments(
      req.user.id,
      filters,
      req.query.page,
      req.query.limit
    );
    
    res.status(200).json({
      success: true,
      ...result
    });
  } catch (err) {
    logger.error(`Failed to get my enrolments: ${err.message}`);
    next(err);
  }
};


const markAttendance = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'ATTENDED' or 'ABSENT'
    
    if (!['ATTENDED', 'ABSENT'].includes(status)) {
      throw new Error('Status must be ATTENDED or ABSENT');
    }
    
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
    next(err);
  }
};


const cancelEnrolment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const enrolment = await enrolmentsService.cancelEnrolment(
      id,
      req.user.id,
      req.user.role
    );
    
    res.status(200).json({
      success: true,
      message: 'Enrolment cancelled successfully',
      data: enrolment
    });
  } catch (err) {
    logger.error(`Failed to cancel enrolment: ${err.message}`);
    next(err);
  }
};

module.exports = {
  createEnrolment,
  getMyEnrolments,
  markAttendance,
  cancelEnrolment
};