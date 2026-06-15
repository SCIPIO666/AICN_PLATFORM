// enrolments/enrolmentController.js
const enrolmentsService = require('./enrolmentService');
const { asyncHandler } = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/responseFormatter');

const createEnrolment = asyncHandler(async (req, res) => {
  const { sessionId } = req.body;
  const enrolment = await enrolmentsService.createEnrolment(req.user.id, sessionId);
  return ApiResponse.created(res, enrolment, 'Successfully enrolled in session');
});

const getMyEnrolments = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 10, fromDate, toDate } = req.query;
  const filters = {};
  if (status) filters.status = status;
  if (fromDate) filters.fromDate = fromDate;
  if (toDate) filters.toDate = toDate;
  filters.status='ENROLLED'
  
  const result = await enrolmentsService.getUserEnrolments(req.user.id, filters, parseInt(page), parseInt(limit));
  
  return ApiResponse.paginated(res, result.enrolments, {
    page: parseInt(page),
    limit: parseInt(limit),
    total: result.total,
    totalPages: result.totalPages,
    hasNextPage: result.hasNextPage,
    hasPrevPage: result.hasPrevPage
  }, 'Enrolments retrieved successfully');
});

const markAttendance = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const enrolment = await enrolmentsService.markAttendance(id, status, req.user.id, req.user.role);
  return ApiResponse.success(res, enrolment, `Attendance marked as ${status}`);
});

const cancelEnrolment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { reason } = req.body;
  const enrolment = await enrolmentsService.cancelEnrolment(id, req.user.id, req.user.role, reason);
  return ApiResponse.success(res, enrolment, 'Enrolment cancelled successfully');
});

module.exports = { createEnrolment, getMyEnrolments, markAttendance, cancelEnrolment };