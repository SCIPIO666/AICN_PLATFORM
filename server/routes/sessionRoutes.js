const express = require('express');
const sessionRouter = express.Router();
const { verifyToken, requireRole } = require('../middleware/authMiddleware');
const sessionsController = require('../modules/sessions/sessionsController');
const  validate  = require('../../middleware/validate');

// validation schemas
const { 
  createSessionSchema, 
  updateSessionSchema, 
  sessionFiltersSchema,
  idParamSchema
} = require('../../shared/validators/sessionValidation');

// ============ PUBLIC ROUTES (No authentication required) ============

// GET / - Get all sessions with filters
sessionRouter.get(
  '/', 
  validate(sessionFiltersSchema, 'query'),  
  sessionsController.getAllSessions
);

// GET /:id - Get session by ID
sessionRouter.get(
  '/:id', 
  validate(idParamSchema, 'params'),  
  sessionsController.getSession
);

// ============ ADMIN ONLY ROUTES ============

// POST / - Create new session
sessionRouter.post(
  '/', 
  verifyToken, 
  requireRole(['ADMIN']),
  validate(createSessionSchema, 'body'), 
  sessionsController.createSession
);

// PUT /:id - Update session
sessionRouter.put(
  '/:id', 
  verifyToken, 
  requireRole(['ADMIN']),
  validate(idParamSchema, 'params'),  
  validate(updateSessionSchema, 'body'),  
  sessionsController.updateSession
);

// DELETE /:id - Cancel/delete session
sessionRouter.delete(
  '/:id', 
  verifyToken, 
  requireRole(['ADMIN']),
  validate(idParamSchema, 'params'), 
  sessionsController.deleteSession
);

module.exports = sessionRouter;