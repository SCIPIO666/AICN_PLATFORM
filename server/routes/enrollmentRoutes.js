const express = require('express');
const enrolmentsRouter = express.Router();
const { verifyToken, requireRole } = require('../middleware/authMiddleware');
const enrolmentsController = require('../modules/enrollments/enrolmentController');
const  validate  = require('../middleware/validate');

// Import validation schemas
const { 
  createEnrolmentSchema,
  markAttendanceSchema,
  enrolmentFiltersSchema,
  idParamSchema,
  cancelEnrolmentSchema
} = require('../../shared/validators/enrolmentValidation');

// All routes require authentication
enrolmentsRouter.use(verifyToken);

// ============ LEARNER ROUTES ============

// POST / - Create enrolment
enrolmentsRouter.post(
  '/', 
  validate(createEnrolmentSchema, 'body'), 
  enrolmentsController.createEnrolment
);

// GET /me - Get my enrolments with filters
enrolmentsRouter.get(
  '/me', 
  validate(enrolmentFiltersSchema, 'query'),  
  enrolmentsController.getMyEnrolments
);

// PATCH /:id/cancel - Cancel enrolment
enrolmentsRouter.patch(
  '/:id/cancel',
  validate(idParamSchema, 'params'),  
  validate(cancelEnrolmentSchema, 'body'),  
  enrolmentsController.cancelEnrolment
);

// ============ TRAINER/ADMIN ROUTES ============

// PATCH /:id/attend - Mark attendance (Trainer or Admin only)
enrolmentsRouter.patch(
  '/:id/attend',
  validate(idParamSchema, 'params'),  
  validate(markAttendanceSchema, 'body'),  
  requireRole(['TRAINER', 'ADMIN']),
  enrolmentsController.markAttendance
);

module.exports = enrolmentsRouter;