const express = require('express');
const announcementsRouter = express.Router();
const { verifyToken, requireRole } = require('../middleware/authMiddleware');
const announcementsController = require('../modules/announcements/announcementsController');
const validate = require('../middleware/validate'); 
const { 
  createAnnouncementSchema, 
  updateAnnouncementSchema,
  announcementFiltersSchema,
  idParamSchema  
} = require('../../shared/validators/announcementValidation');

// ============= public=============

announcementsRouter.get(
  '/', 
  validate(announcementFiltersSchema, 'query'), 
  announcementsController.getAllAnnouncements
);

// GET /announcements/:id -  param validation
announcementsRouter.get(
  '/:id', 
  validate(idParamSchema, 'params'), 
  announcementsController.getAnnouncementById
);

// ============= RBAC admin only=============
announcementsRouter.use(verifyToken);
announcementsRouter.use(requireRole(['ADMIN']));

// POST /announcements - create new
announcementsRouter.post(
  '/', 
  validate(createAnnouncementSchema, 'body'), 
  announcementsController.createAnnouncement
);

// PUT /announcements/:id 
announcementsRouter.put(
  '/:id',
  validate(idParamSchema, 'params'),      
  validate(updateAnnouncementSchema, 'body'), 
  announcementsController.updateAnnouncement
);

// DELETE /announcements/:id - delete
announcementsRouter.delete(
  '/:id',
  validate(idParamSchema, 'params'), 
  announcementsController.deleteAnnouncement
);

module.exports = announcementsRouter;