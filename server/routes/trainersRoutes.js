const express = require('express');
const trainersRouter = express.Router();
const { verifyToken, requireRole } = require('../middleware/authMiddleware');
const trainersController = require('../modules/trainers/trainersController');
const validate  = require('../middleware/validate');

//validation schemas
const { 
  createTrainerProfileSchema, 
  updateTrainerProfileSchema, 
  updateTrainerStatusSchema,
  rejectionSchema,
  trainerFiltersSchema,
  trainerSessionFiltersSchema,
  idParamSchema,
  approvalSchema
} = require('../../shared/validators/trainerValidation');

// ============ PUBLIC ROUTES (No authentication) ============
// None - all trainer routes require authentication

// ============ PROTECTED ROUTES (Authentication required) ============
trainersRouter.use(verifyToken); // Apply to all routes below

// GET / - Now requires authentication (but not necessarily admin)
trainersRouter.get(
  '/', 
  validate(trainerFiltersSchema, 'query'),
  trainersController.getApprovedTrainers 
);

// Learner applies to become trainer
trainersRouter.post(
  '/apply', 
  validate(createTrainerProfileSchema, 'body'),
  trainersController.applyForTrainer
);

// Get my trainer profile
trainersRouter.get('/me', trainersController.getMyTrainerProfile);

// Update my trainer profile
trainersRouter.patch(
  '/me', 
  validate(updateTrainerProfileSchema, 'body'),
  trainersController.updateMyTrainerProfile
);

// Withdraw my application
trainersRouter.delete('/me', trainersController.withdrawApplication);

// Get my sessions (Trainer/Admin only)
trainersRouter.get(
  '/me/sessions',
  requireRole('TRAINER', 'ADMIN'),
  validate(trainerSessionFiltersSchema, 'query'),
  trainersController.getMySessions
);

// ============ ADMIN ONLY ROUTES ============

// Get ALL applications (including PENDING) - Admin only
trainersRouter.get(
  '/admin/applications',
  requireRole('ADMIN'),
  validate(trainerFiltersSchema, 'query'),
  trainersController.getAllTrainerApplications
);

// Get application by ID
trainersRouter.get(
  '/admin/applications/:id',
  requireRole('ADMIN'),
  validate(idParamSchema, 'params'),
  trainersController.getTrainerApplicationById
);

// Approve application
trainersRouter.patch(
  '/admin/applications/:id/approve',
  requireRole('ADMIN'),
  validate(idParamSchema, 'params'),
  validate(approvalSchema, 'body'),
  trainersController.approveTrainerApplication
);

// Reject application
trainersRouter.patch(
  '/admin/applications/:id/reject',
  requireRole('ADMIN'),
  validate(idParamSchema, 'params'),
  validate(rejectionSchema, 'body'),
  trainersController.rejectTrainerApplication
);

// Delete application
trainersRouter.delete(
  '/admin/applications/:id',
  requireRole('ADMIN'),
  validate(idParamSchema, 'params'),
  trainersController.deleteTrainerApplication
);

module.exports = trainersRouter;