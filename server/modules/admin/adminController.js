// admin/adminController.js
const adminService = require('./adminService');
const { asyncHandler } = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/responseFormatter');
const logger = require('../../utils/logger');

const getStats = asyncHandler(async (req, res) => {
  const stats = await adminService.getStats(req.user.id, req.user.role);
  return ApiResponse.success(res, stats, 'Statistics retrieved successfully');
});

const getAllUsers = asyncHandler(async (req, res) => {
  const { role, search, page = 1, limit = 10 } = req.query;
  
  const filters = {};
  if (role) filters.role = role;
  if (search) filters.search = search;
  
  const result = await adminService.getAllUsers(
    filters,
    parseInt(page),
    parseInt(limit),
    req.user.id,
    req.user.role
  );
  
  return ApiResponse.paginated(res, result.data, result.pagination, 'Users retrieved successfully');
});

const updateUserRoleController = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { newRole, approvalMessage, rejectionReason, isRejection } = req.body;
  
  const updatedUser = await adminService.updateUserRole(
    userId, 
    newRole, 
    req.user.id, 
    req.user.role,
    { approvalMessage, rejectionReason, isRejection: isRejection || false }
  );
  
  return ApiResponse.success(res, {
    userId: updatedUser.id,
    email: updatedUser.email,
    name: updatedUser.name,
    role: updatedUser.role,
    updatedAt: updatedUser.updated_at
  }, `User role updated to ${newRole} successfully`);
});

const createAnnouncement = asyncHandler(async (req, res) => {
  const announcement = await adminService.createAnnouncement(
    req.body,
    req.user.id,
    req.user.role
  );
  return ApiResponse.created(res, announcement, 'Announcement created successfully');
});

const getAllAnnouncements = asyncHandler(async (req, res) => {
  const { audience, page = 1, limit = 10 } = req.query;
  
  const filters = {};
  if (audience) filters.audience = audience;
  
  const result = await adminService.getAllAnnouncements(
    filters,
    parseInt(page),
    parseInt(limit),
    req.user.id,
    req.user.role
  );
  
  return ApiResponse.paginated(res, result.data, result.pagination, 'Announcements retrieved successfully');
});

const updateAnnouncement = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updated = await adminService.updateAnnouncement(
    id,
    req.body,
    req.user.id,
    req.user.role
  );
  return ApiResponse.success(res, updated, 'Announcement updated successfully');
});

const deleteAnnouncement = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await adminService.deleteAnnouncement(id, req.user.id, req.user.role);
  return ApiResponse.noContent(res, 'Announcement deleted successfully');
});

module.exports = {
  getStats,
  getAllUsers,
  updateUserRoleController,
  createAnnouncement,
  getAllAnnouncements,
  updateAnnouncement,
  deleteAnnouncement
};