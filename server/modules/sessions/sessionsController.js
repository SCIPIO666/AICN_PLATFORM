
const sessionsService = require('./sessionsService');
const { asyncHandler } = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/responseFormatter');

const getAllSessions = asyncHandler(async (req, res) => {
  let { status, skillArea, locationType, county, trainerId, fromDate, toDate, upcoming, page = 1, limit = 10 } = req.query;
  
  const filters = { page: parseInt(page), limit: parseInt(limit) };
  if (status) filters.status = status;
  if (skillArea) filters.skillArea = skillArea;
  if (locationType) filters.locationType = locationType;
  if (county) filters.county = county;
  if (trainerId) filters.trainerId = trainerId;
  if (fromDate) filters.fromDate = fromDate;
  if (toDate) filters.toDate = toDate;
  if (upcoming === 'true') filters.fromDate = new Date().toISOString();
  
  const result = await sessionsService.getAllSessions(filters);
  
  return ApiResponse.paginated(res, result.sessions, {
    page: parseInt(page), limit: parseInt(limit), total: result.total,
    totalPages: result.totalPages, hasNextPage: result.hasNextPage, hasPrevPage: result.hasPrevPage
  }, 'Sessions retrieved successfully');
});

const getSession = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const session = await sessionsService.getSession(id);
  return ApiResponse.success(res, session, 'Session retrieved successfully');
});

const createSession = asyncHandler(async (req, res) => {
  const session = await sessionsService.createSession(req.body);
  return ApiResponse.created(res, session, 'Session created successfully');
});

const updateSession = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const session = await sessionsService.updateSession(id, req.body);
  return ApiResponse.success(res, session, 'Session updated successfully');
});

const deleteSession = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const cancelledSession = await sessionsService.cancelSession(id);
  return ApiResponse.success(res, cancelledSession, 'Session cancelled successfully');
});

module.exports = { getAllSessions, getSession, createSession, updateSession, deleteSession };