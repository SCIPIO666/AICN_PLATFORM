const express = require('express');
const trainersRouter = express.Router();
const { verifyToken, requireRole } = require('../../middleware/authMiddleware');
const trainersController = require('./trainersController');
const { validate } = require('../../middleware/validate');
const { createTrainerProfileSchema, updateTrainerProfileSchema, updateTrainerStatusSchema } = require('../../validation');

// Public routes 
trainersRouter.get('/', trainersController.getAllTrainerApplications);

// Protected routes 
trainersRouter.use(verifyToken);
trainersRouter.post('/apply', validate(createTrainerProfileSchema), trainersController.applyForTrainer);
trainersRouter.get('/me', trainersController.getMyTrainerProfile);
trainersRouter.patch('/me', validate(updateTrainerProfileSchema), trainersController.updateMyTrainerProfile);
trainersRouter.delete('/me', trainersController.withdrawApplication);

// RBAC Admin only
trainersRouter.get('/admin/all', requireRole(['ADMIN']), trainersController.getAllTrainerApplications);
trainersRouter.get('/admin/:id', requireRole(['ADMIN']), trainersController.getTrainerApplicationById);
trainersRouter.patch('/admin/:id/approve', requireRole(['ADMIN']), trainersController.approveTrainerApplication);
trainersRouter.patch('/admin/:id/reject', requireRole(['ADMIN']), trainersController.rejectTrainerApplication);
trainersRouter.delete('/admin/:id', requireRole(['ADMIN']), trainersController.deleteTrainerApplication);
// RBAC admin /trainer
trainersRouter.get('/me/sessions', 
  verifyToken, 
  requireRole(['TRAINER', 'ADMIN']), 
  trainersController.getMySessions
);
module.exports = trainersRouter;