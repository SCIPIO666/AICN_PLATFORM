// trainers/trainersController.js
const trainersService = require('./trainersService');
const { asyncHandler } = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/responseFormatter');

const applyForTrainer = asyncHandler(async (req, res) => {
  const result = await trainersService.applyForTrainer(req.user.id, req.body);
  return ApiResponse.created(res, result, 'Trainer application submitted successfully');
});

const getMyTrainerProfile = asyncHandler(async (req, res) => {
  const profile = await trainersService.getMyTrainerProfile(req.user.id);
  return ApiResponse.success(res, profile, 'Trainer profile retrieved successfully');
});

const updateMyTrainerProfile = asyncHandler(async (req, res) => {
  const updated = await trainersService.updateMyTrainerProfile(req.user.id, req.body);
  return ApiResponse.success(res, updated, 'Trainer profile updated successfully');
});

const withdrawApplication = asyncHandler(async (req, res) => {
  const result = await trainersService.withdrawApplication(req.user.id);
  return ApiResponse.success(res, null, result.message);
});

const getAllTrainerApplications = asyncHandler(async (req, res) => {
  const { status, skill, page = 1, limit = 10, search } = req.query;
  const filters = {};
  if (status) filters.status = status;
  if (skill) filters.skill = skill;
  if (search) filters.search = search;
  
  const result = await trainersService.getAllTrainerApplications(filters, parseInt(page), parseInt(limit));
  
  return ApiResponse.paginated(res, result.applications, {
    page: parseInt(page), limit: parseInt(limit), total: result.total,
    totalPages: result.totalPages, hasNextPage: result.hasNextPage, hasPrevPage: result.hasPrevPage
  }, 'Trainer applications retrieved successfully');
});

const getTrainerApplicationById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const application = await trainersService.getTrainerApplicationById(id, req.user.id, req.user.role);
  return ApiResponse.success(res, application, 'Trainer application retrieved successfully');
});

const approveTrainerApplication = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { message } = req.body;
  const result = await trainersService.approveTrainerApplication(id, req.user.id, message);
  return ApiResponse.success(res, result, 'Trainer application approved successfully');
});

const rejectTrainerApplication = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { reason, feedback } = req.body;
  const result = await trainersService.rejectTrainerApplication(id, req.user.id, { reason, feedback });
  return ApiResponse.success(res, result, 'Trainer application rejected');
});

const deleteTrainerApplication = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await trainersService.deleteTrainerApplication(id, req.user.id);
  return ApiResponse.success(res, null, result.message);
});

const getMySessions = asyncHandler(async (req, res) => {
  const { status, fromDate, toDate, page = 1, limit = 10 } = req.query;
  const filters = { page: parseInt(page), limit: parseInt(limit) };
  if (status) filters.status = status;
  if (fromDate) filters.fromDate = fromDate;
  if (toDate) filters.toDate = toDate;
  
  const result = await trainersService.getTrainerSessions(req.user.id, req.user.role, filters);
  
  return ApiResponse.paginated(res, result.sessions, {
    page: parseInt(page), limit: parseInt(limit), total: result.total,
    totalPages: result.totalPages, hasNextPage: result.hasNextPage, hasPrevPage: result.hasPrevPage
  }, 'Sessions retrieved successfully');
});

const getApprovedTrainers = asyncHandler(async (req, res) => {
  const { skill, page = 1, limit = 10, search } = req.query;
  const filters = {};
  if (skill) filters.skill = skill;
  if (search) filters.search = search;
  
  const result = await trainersService.getApprovedTrainers(filters, parseInt(page), parseInt(limit));
  
  return ApiResponse.paginated(res, result.trainers, {
    page: parseInt(page), limit: parseInt(limit), total: result.total, totalPages: result.totalPages
  }, 'Approved trainers retrieved successfully');
});

module.exports = { applyForTrainer, getMyTrainerProfile, updateMyTrainerProfile, withdrawApplication, getAllTrainerApplications, getTrainerApplicationById, approveTrainerApplication, rejectTrainerApplication, deleteTrainerApplication, getMySessions, getApprovedTrainers };