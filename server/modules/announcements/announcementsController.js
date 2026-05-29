// announcements/announcementsController.js
const announcementsService = require('./announcementsService');
const { asyncHandler } = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/responseFormatter');

const createAnnouncement = asyncHandler(async (req, res) => {
  const announcement = await announcementsService.createAnnouncement(
    req.body,
    req.user.id,
    req.user.role
  );
  return ApiResponse.created(res, announcement, 'Announcement created successfully');
});

const getAnnouncementById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const announcement = await announcementsService.getAnnouncementById(id, req.user?.role || 'LEARNER');
  return ApiResponse.success(res, announcement, 'Announcement retrieved successfully');
});

const getAllAnnouncements = asyncHandler(async (req, res) => {
  const { audience, fromDate, toDate, page = 1, limit = 10 } = req.query;
  
  const filters = {};
  if (audience) filters.audience = audience;
  if (fromDate) filters.fromDate = fromDate;
  if (toDate) filters.toDate = toDate;
  
  const result = await announcementsService.getAllAnnouncements(
    filters,
    parseInt(page),
    parseInt(limit),
    req.user?.role || 'LEARNER'
  );
  
  return ApiResponse.paginated(res, result.data, result.pagination, 'Announcements retrieved successfully');
});

const updateAnnouncement = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updated = await announcementsService.updateAnnouncement(
    id,
    req.body,
    req.user.id,
    req.user.role
  );
  return ApiResponse.success(res, updated, 'Announcement updated successfully');
});

const deleteAnnouncement = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await announcementsService.deleteAnnouncement(id, req.user.id, req.user.role);
  return ApiResponse.success(res, null, result.message);
});

module.exports = {
  createAnnouncement,
  getAnnouncementById,
  getAllAnnouncements,
  updateAnnouncement,
  deleteAnnouncement
};