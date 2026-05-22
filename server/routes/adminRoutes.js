const express = require('express');
const adminRouter = express.Router();
const { verifyToken, requireRole } = require('../middleware/authMiddleware');
const adminController = require('../modules/admin/adminController');
const { validate } = require('../middleware/validate');
const { createAnnouncementSchema, updateAnnouncementSchema } = require('../../shared/validators/announcementValidation');

// All admin routes require authentication and ADMIN role
adminRouter.use(verifyToken);
adminRouter.use(requireRole(['ADMIN']));

// Stats
adminRouter.get('/stats', adminController.getStats);

// User management
adminRouter.get('/users', adminController.getAllUsers);
adminRouter.patch('/users/:userId/role', adminController.updateUserRole);

// Announcement management
adminRouter.post('/announcements', validate(createAnnouncementSchema), adminController.createAnnouncement);
adminRouter.get('/announcements', adminController.getAllAnnouncements);
adminRouter.put('/announcements/:id', validate(updateAnnouncementSchema), adminController.updateAnnouncement);
adminRouter.delete('/announcements/:id', adminController.deleteAnnouncement);

module.exports = adminRouter;