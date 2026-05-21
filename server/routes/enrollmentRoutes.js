const express = require('express');
const enrolmentsRouter = express.Router();
const { verifyToken, requireRole } = require('../../middleware/authMiddleware');
const enrolmentsController = require('./enrolmentsController');

enrolmentsRouter.use(verifyToken); //all need verification

// learners
enrolmentsRouter.post('/', enrolmentsController.createEnrolment);
enrolmentsRouter.get('/me', enrolmentsController.getMyEnrolments);
enrolmentsRouter.patch('/:id/cancel', enrolmentsController.cancelEnrolment);

// Trainer/Admin 
enrolmentsRouter.patch('/:id/attend', 
  requireRole(['TRAINER', 'ADMIN']), 
  enrolmentsController.markAttendance
);

module.exports = enrolmentsRouter;