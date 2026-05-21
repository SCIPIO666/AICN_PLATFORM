const express = require('express');
const announcementsRouter = express.Router();
const { verifyToken, requireRole } = require('../../middleware/authMiddleware');
const announcementsController = require('./announcementsController');
const { validate } = require('../../middleware/validate');
const { createAnnouncementSchema, updateAnnouncementSchema } = require('../../validation');

// Public routes (no authentication required for viewing)
announcementsRouter.get('/', announcementsController.getAllAnnouncements);
announcementsRouter.get('/:id', announcementsController.getAnnouncementById);

// Admin only routes (full CRUD)
announcementsRouter.use(verifyToken);
announcementsRouter.use(requireRole(['ADMIN']));

announcementsRouter.post('/', validate(createAnnouncementSchema), announcementsController.createAnnouncement);
announcementsRouter.put('/:id', validate(updateAnnouncementSchema), announcementsController.updateAnnouncement);
announcementsRouter.delete('/:id', announcementsController.deleteAnnouncement);

module.exports = announcementsRouter;